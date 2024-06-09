import os
import json
from gql import gql
from specklepy.api.client import SpeckleClient
from pprint import pprint
from uuid import uuid4
from dotenv import load_dotenv, dotenv_values
env = dotenv_values(".env."+os.environ.get('NODE_ENV', 'development'))

TOKEN = env["APP_TOKEN"]

def find_type_mark_value(data):
    """
    Opens the JSON file and finds a family with the property that contains a nested property
    with the prop['name']="Type Mark" and returns the prop['value'].
    
    :param data: The parameters.
    :return: The value of the "Type Mark" property if found, else None.
    """
    for param_id, param_data in data.get("parameters", {}).items():
        if param_data.get("name") == "Type Mark":
            return param_data.get("value")
    return None

def latest_ref_obj(client, speckle_info):
    stream = speckle_info["stream"]
    branch = speckle_info["model"]
    bquery = """
    query Branches {
        stream(id: "%s"){
            branches {
                items {
                    name
                    id
                    commits {
                        items {
                            id
                        }
                    }
                }
            }
        }
    }
    """ %(stream)
    res = client.httpclient.execute(gql(bquery));
    branches = res["stream"]["branches"]["items"]
    commit = None
    branch_name = None
    for b in branches:
        if not b["id"] == branch: continue
        commit = b["commits"]["items"][0]["id"]
        branch_name = b["name"]
        pass
    rquery = """
    query refObj {
        stream(id: "%s"){
            commit(id: "%s"){
                referencedObject
            }
        }
    }
    """ % (stream, commit)
    res = client.httpclient.execute(gql(rquery));
    ref_obj = {"model_name": branch_name,  
            "obj":res["stream"]["commit"]["referencedObject"]}
    return ref_obj

def create_branch(client, model_name, proposal, speckle_info):
    mut = """
    mutation BranchCreate($branch: BranchCreateInput!){
        branchCreate(branch: $branch)
    }
    """ 
    params = {
     "branch": {
         "streamId": speckle_info["stream"], 
         "name": "main/%s/proposal_%s" % (model_name, proposal), 
         "description": "Made by FamilyMan"

         }
    }
    branch = client.httpclient.execute(gql(mut), params)["branchCreate"]
    return branch

def create_commit(client, branch_name, speckle_info, obj):
    mut = """
    mutation CommitCreate($commit: CommitCreateInput!){
        commitCreate(commit: $commit)
    }
    """
    params = {
        "commit": {
                "streamId": speckle_info["stream"],
                "sourceApplication": "Revit 2023",
                "objectId": obj,
                "branchName": branch_name,
                "message": "Made by FamilyMan"
            }
        }
    commit = client.httpclient.execute(gql(mut), params)["commitCreate"]
    return commit

def create_object(client, speckle_info, data):
    mut = """
    mutation ObjectCreate($objectInput: ObjectCreateInput!){
        objectCreate(objectInput: $objectInput)
    }
    """
    params = {
        "objectInput": {
                "streamId": speckle_info["stream"],
                "objects": [data]
            }
    }
    obj = client.httpclient.execute(gql(mut), params)["objectCreate"]
    return obj

def updateParams(obj, new_dict):
    old_params = obj["parameters"]
    old_params_names = []
    old_params_keys = []
    for k, v in old_params.items():
        if isinstance(v, dict):
            old_params_names.append(v["name"])
            old_params_keys.append(k)
        pass
    new_ps = list(new_dict["parameters"].values())
    new_ps_names = [d["name"] for d in new_ps]
    for k, v in new_dict["parameters"].items():
        name = v["name"]
        speckle_name = name
        if v["guid"] in obj["parameters"]:
            speckle_name = v["guid"]
        elif name in old_params_names:
            idx = old_params_names.index(name)
            speckle_name = old_params_keys[idx]
            pass
        else: continue
        obj["parameters"][speckle_name]["value"] = v["value"]
        obj["parameters"][speckle_name]["id"] = "fman_"+str(uuid4())
        pass
    obj["parameters"]["id"] = "fman_"+str(uuid4())
    obj["id"] = "fman_"+str(uuid4())
    return obj

def create_speckle_objects(revit_uuid, speckle_info, new_data, proposal_id):
    """Find associate speckle model with the revit uuid
    """
    stream = speckle_info["stream"]
    branch = speckle_info["model"]
    client = SpeckleClient(host = "app.speckle.systems");
    client.authenticate_with_token(TOKEN)
    ref_obj = latest_ref_obj(client, speckle_info);
    pprint(ref_obj)
    query = """
    query refObj($query: [JSONObject!]){
        stream(id:"%s"){
            object(id:"%s"){
                children(depth: 300, query: $query){
                    objects {
                        data
                    }
                }
            }
        }
    }
    """ % (stream, ref_obj["obj"])
    params = {
            "query": {
                    "field": "applicationId"
                    ,"value": revit_uuid
                    ,"operator": "=" 
                }
            }
    pprint(query)
    pprint(params)
    res = client.httpclient.execute(gql(query), params)
    #pprint(res);
    new_obj = res["stream"]["object"]["children"]["objects"][0]["data"]
    # Update with new parameters
    newer_obj = updateParams(new_obj, new_data)
    # Write to speckle object
    new_obj_id = create_object(client, speckle_info, newer_obj)[0]
    branch_name = create_branch(client, ref_obj["model_name"], proposal_id, speckle_info)
    commit = create_commit(client, branch_name, speckle_info, new_obj_id) 
    
    pprint(new_obj_id)
    pprint(commit)
    pass

def create_proposal(filepath, data, proposal_id, speckle_info):
    proposal_folder = os.path.join(os.path.dirname(filepath), "proposals")
    proposal_file = os.path.join(proposal_folder, proposal_id + ".json")
    with open(proposal_file, "w") as f:
        f.write(json.dumps(data));
    create_speckle_objects(list(data["families"].keys())[0], 
            speckle_info, 
            list(data["families"].values())[0],
            proposal_id)
    pass

def update_db(filepath, data, proposal_id, speckle_info):
    """
    Update the database JSON file with new family data, ensuring no duplicate 'Type Mark' values are added.
    
    This function reads the provided JSON file at the specified filepath, checks for families with
    'Type Mark' values in the input data, and updates the database JSON file with new family data,
    avoiding duplicates based on the 'Type Mark' values.

    :param filepath: The path to the JSON file to be updated.
    :param data: The input data containing new families to be added.
    :return: None
    """
    type_marks = []
    for family_id, family_data in data.get("families", {}).items():
        type_mark = find_type_mark_value(family_data)
        if type_mark:
            type_marks.append({"id": family_id, "Type Mark": type_mark})
        else:
            print(f"Input family {family_id} has no type mark. Skipping.")

    with open(filepath, 'r') as file:
        db_data = json.load(file)

        # Check for existing type marks in the database
        existing_type_marks = set()
        for db_family_id, db_family_data in db_data.get("families", {}).items():
            for db_param_id, db_param_data in db_family_data.get("parameters", {}).items():
                if db_param_data.get("name") == "Type Mark":
                    existing_type_marks.add(db_param_data.get("value"))

        # Add new families to the database, avoiding duplicates
        for new_family in type_marks:
            if new_family["Type Mark"] in existing_type_marks:
                print(f"Existing type mark '{new_family['Type Mark']}' found in database. Skipping.")
            else:
                # Add the new family to the database
                db_data["families"][new_family["id"]] = data["families"][new_family["id"]]
                print (f"Adding family '{new_family['id']}' to database.")

        create_proposal(filepath, data, proposal_id, speckle_info);

    # Write the updated database back to the file
    with open(filepath, 'w') as file:
        json.dump(db_data, file, indent=4)

    print("Database update complete.")

def match_typemark(filepath, type_mark):
    """
    Opens the JSON file and tries to find a family with a Type Mark matching the input typemark.
    
    :param filepath: The path to the JSON file.
    :param type_mark: The type mark to search for.
    :return: The value of the "Type Mark" property if found, else None.
    """
    with open(filepath, 'r') as file:
        data = json.load(file)
        
        for family_id, family_data in data.get("families", {}).items():
            for param_id, param_data in family_data.get("parameters", {}).items():
                if param_data.get("name") == "Type Mark" and param_data.get("value") == type_mark:
                    rfa = param_data.get("filepath")
                    if rfa:
                        return rfa
                    else:
                        return "test000.rfa"
    
    return None
