import os
import json

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

def update_db(filepath, data):
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