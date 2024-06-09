/**
 * Changer.tsx
 * @author Bob Lee
 */

import type { Component } from 'solid-js';
import { For, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { currentFamily, parameterStore } from '../App';
import { Toast } from '../components/Toast';
import { modelURL } from '../components/Header';
import axios from 'axios';
import { cloneDeep } from 'lodash';

const CHANGE_REQ_URL = import.meta.env.VITE_API_URL + "/update_database";
const EG_SPECKLE_URL = "https://app.speckle.systems/projects/58ae34f884/models/87584774f1";

const [stagedParameters, setStagedParameters] = createStore<any>();

function speckleinfo(url = EG_SPECKLE_URL){
  const re_stream = /(?<=projects\/)(.*)(?=\/models)/g;
  const re_model = /(?<=models\/)(.*)/g;
  const stream_id = url.match(re_stream)[0];
  const model_id = url.match(re_model)[0];
  console.log(stream_id, model_id);
  return {"stream": stream_id, "model": model_id}
}

function updateParam(e : any){
  let field = e.target as HTMLInputElement;
  let value = field.value;
  let key = field.getAttribute("data-param-id");
  if (key === null){return;}
  let updated = cloneDeep(stagedParameters[key])
  updated.value = value;
  setStagedParameters(key, updated);
}

async function sendChangeRequest(e : any) {

  const info = speckleinfo(modelURL());
  const proposal = String(new Date().getTime());

  let new_parameters = cloneDeep(stagedParameters);
  let uuid = currentFamily().uuid;
  let name = currentFamily().name;
  let ftype = currentFamily().ftype;
  let category = currentFamily().category;
  console.log({...stagedParameters});

  let payload = {
    families: {
      [uuid]: {
        name: name,
        ftype: ftype,
        category: category,
        parameters: new_parameters
      }
    }
  }
  let config = {
    url: CHANGE_REQ_URL,
    method: 'post',
    data: {
      stream: info.stream
      ,model: info.model
      ,proposal: proposal
      ,input_data: payload
    }
  }
  console.log(config);
  let  res = await axios(
    config
  );
  console.log(res);
  let t = new Toast("FamilyMan", "", "Change Request Submitted!");
  
  t.show();

}

const Changer : Component = () => {

  onMount(()=>{
    for (const key of Object.keys(stagedParameters)){
        setStagedParameters(key, undefined);
    }
    console.log(parameterStore);
  });

  return (
    <>
      <div class = "m-4">
        <div class = "row mb-2">
          <div class = "col-auto me-auto">
            <h5>{currentFamily().name}</h5>
            <h6>{currentFamily().ftype}</h6>
          </div>
          <div class = "col-auto">
            <button data-label="Request Change" class = "btn btn-primary" onclick = {(e) => sendChangeRequest(e)}>Request Change</button>
          </div>
        </div>
            <For each = { Object.keys(parameterStore) }>
        {
          (key, i) => {
            let name = parameterStore[key]["name"];
            let value = parameterStore[key]["value"];
            setStagedParameters(key, parameterStore[key]);
            return (
              <>
                <div class = "row mb-3">
                  <div class = "col-6">{name}</div>
                  <div class = "col-6">
                    <input data-param-id = {key} 
                      type="text" 
                      class="col-2 form-control"
                      onkeyup = {(e)=> updateParam(e)}
                      value = {value}></input>
                  </div>
                </div>
              </>
            )
         }
        }
      </For>
      </div>
    </>

  );
}

export default Changer;
