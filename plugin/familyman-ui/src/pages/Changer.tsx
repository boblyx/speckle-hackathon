/**
 * Changer.tsx
 * @author Bob Lee
 */

import type { Component } from 'solid-js';
import { For, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { currentFamily, parameterStore } from '../App';
import { Toast } from '../components/Toast';

async function sendChangeRequest() {
  let t = new Toast("FamilyMan", "", "Change Request Submitted!");
  t.show();
}

const Changer : Component = () => {

  onMount(()=>{
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
            <button class = "btn btn-primary" onclick = {() => sendChangeRequest()}> Request Change</button>
          </div>
        </div>
            <For each = { Object.keys(parameterStore) }>
        {
          (key, i) => {
            let name = parameterStore[key]["name"];
            let value = parameterStore[key]["value"];
            return (
              <>
                <div class = "row mb-3">
                  <div class = "col-6">{name}</div>
                  <div class = "col-6">
                    <input type="text" class="col-2 form-control" value = {value}></input>
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
