from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv, dotenv_values
from utils.db_utils import match_typemark, find_type_mark_value, update_db
import subprocess
from pprint import pprint;
import re;
import json 
from typing import Dict, Any

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:3000",
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AccessCodeRequest(BaseModel):
    accessCode: str
    challenge: str

class QueryRequest(BaseModel):
    query: str
    token: str

class UpdateRequest(BaseModel):
    input_data: Dict[str, Any]
    stream: str
    model: str
    proposal: str

class MatchRequest(BaseModel):
    stream: str
    model: str
    type_mark: str

class InitRequest(BaseModel):
    speckle : str
    families : dict
    pass

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env.' + os.environ.get('NODE_ENV', 'development'))
load_dotenv(dotenv_path)
env = dotenv_values(".env."+os.environ.get('NODE_ENV', 'development'))
DB_OUT = os.getenv('DB_OUT') #
if DB_OUT == None: DB_OUT = os.path.join(os.getcwd(), "db")
SPECKLE_URL = os.getenv('VITE_SPECKLE_URL')
APP_SPECKLE_ID = os.getenv('VITE_SPECKLE_ID')
APP_SPECKLE_NAME = os.getenv('VITE_SPECKLE_NAME')
APP_SPECKLE_SECRET = os.getenv('VITE_SPECKLE_SECRET')
# APP_EXCEL_DATABASE_WINDOWS = os.getenv('APP_EXCEL_DATABASE') + '.xlsx'
# APP_EXCEL_DATABASE_WSL = subprocess.check_output(['wslpath', APP_EXCEL_DATABASE_WINDOWS]).decode().strip()
APP_DATABASE_WINDOWS_FOLDER = os.getenv('APP_DATABASE')
# Convert the Windows-style path to a WSL path
try:
    APP_DATABASE_WSL_FOLDER = subprocess.check_output(['wslpath', APP_DATABASE_WINDOWS_FOLDER]).decode().strip()
    print("WSL Path: ", APP_DATABASE_WSL_FOLDER)
except subprocess.CalledProcessError as e:
    print(f"Error converting path: {e}")

if not SPECKLE_URL or not APP_SPECKLE_ID or not APP_SPECKLE_NAME or not APP_SPECKLE_SECRET:
    raise EnvironmentError("Missing one or more required environment variables")

@app.post("/exchange-access-code")
def exchange_access_code(request: AccessCodeRequest):
    req_body = {
        'accessCode': request.accessCode,
        'appId': APP_SPECKLE_ID,
        'appSecret': APP_SPECKLE_SECRET,
        'challenge': request.challenge
    }

    token_url = f"{SPECKLE_URL}/auth/token"
    try:
        response = requests.post(token_url, json=req_body)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx and 5xx)
        response_data = response.json()
        return response_data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/initialize_db")
def initialize_db(request : InitRequest):
    url = request.speckle;
    project_id = re.search("(?<=projects\/)(.*)(?=\/models)", url).group(0)
    model_id = re.search("(?<=models\/)(.*)", url).group(0)
    new_db = os.path.join(DB_OUT, "stream_" + project_id)
    new_model = os.path.join(new_db, "model_" + model_id)
    new_proposal = os.path.join(new_model, "proposals")
    new_family_ledger = os.path.join(new_model, "master.json")
    os.makedirs(new_proposal, exist_ok=True)
    flattened_families = {"families": {}}
    for cat, families in request.families.items():
        for uid, params in families.items():
            flattened_families["families"][uid] = params
        pass
    pprint(flattened_families);
    with open(new_family_ledger, "w") as f:
        f.write(json.dumps(flattened_families));
        pass
    # TODO: raise error if id is wrong
    return {"result": "OK"}

@app.post("/speckle-query")
def speckle_query(request: QueryRequest):
    query_data = {
        "query": request.query
    }
    headers = {
        "Authorization": f"Bearer {request.token}",
        "Content-Type": "application/json"
    }

    query_url = f"{SPECKLE_URL}/graphql"
    try:
        response = requests.post(query_url, headers=headers, json=query_data)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx and 5xx)
        response_data = response.json()
        return response_data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match_family")
def match_family(request: MatchRequest):
    response_data = {"Response : Something went wrong with graphql"}
    file_path = os.path.join(APP_DATABASE_WSL_FOLDER, f"stream_{request.stream}", f"model_{request.model}","master.json")
    # OBTAIN TYPEMARK INFORMATION
    try:
        match_result = match_typemark(filepath=file_path, type_mark=request.type_mark)
        if match_result:
            print(f"The corresponding filepath is: {match_result}")
            return match_result
        else:
            print("No matching type mark found or an error occurred.")
            return response_data

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/update_database")
def update_database(request: UpdateRequest):
    response_data = {"Response" : "Something went wrong with database update."}

    if request.stream == "" or request.stream == None:
        response_data = {"Response" : "Unable to detect stream in request parameters."}
        return response_data
    
    if request.model == "" or request.model == None:
        response_data = {"Response" : "Unable to detect model in request parameters."}
        return response_data
    
    if request.proposal == "" or request.proposal == None:
        response_data = {"Response" : "Unable to detect proposal in request parameters."}
        return response_data

    speckle_info = {"stream": request.stream, 
            "model": request.model, 
            "proposal": request.proposal}
    
    try:
        db_file_path = os.path.join(APP_DATABASE_WSL_FOLDER, f"stream_{request.stream}", f"model_{request.model}","master.json")
        update_db(db_file_path, request.input_data, request.proposal, speckle_info)
        return {"Response" : "Updating of database complete."}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# @app.post("/retrieve_database")
# def retrieve_database():
#     response_data = {"Response":"Something went wrong with retrieving database."}
#     try:
#         data_dict = extractDatabase(filepath=APP_EXCEL_DATABASE_WSL)
#         if data_dict:
#             return data_dict
    
#     except requests.exceptions.RequestException as e:
#         raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


## UTILITIES - FORMATTED GRAPHQL QUERY
# refObj_query = {
#     "query" : '''
#                 query {{
#                     stream(id: "{0}") {{
#                         commit(id: "{1}") {{
#                             referencedObject
#                         }}
#                     }}
#                 }}
#             '''.format(request.stream, request.commit)
# }

# headers = {
#     "Authorization": f"Bearer {request.token}",
#     "Content-Type": "application/json"
# }

# query_url = f"{SPECKLE_URL}/graphql"

# # OBTAIN REFERENCE OBJECT FROM COMMIT ID
# try:
#     response = requests.post(query_url, headers=headers, json=refObj_query)
#     response.raise_for_status()  # Raises HTTPError for bad responses (4xx and 5xx)
#     response_data = response.json()
#     refObj = response_data['data']['stream']['commit']['referencedObject']
#     if refObj == None or refObj == "":
#         return response_data
#     print (refObj)

# except requests.exceptions.RequestException as e:
#     raise HTTPException(status_code=500, detail=str(e))
