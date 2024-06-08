/**
 * Changer.tsx
 * @author Bob Lee
 */

import type { Component } from 'solid-js';
import { For, onMount } from 'solid-js';
import { currentFamily } from '../App';
import { parameterStore, setParameterStore } from '../App';

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
            <button class = "btn btn-primary"> Request Change</button>
          </div>
        </div>
            <For each = { Object.keys(parameterStore) }>
        {
          (key, i) => {
            let name = parameterStore[key]["name"];
            let value = parameterStore[key]["value"];
            return (
              <>
                <div class = "input-group mb-3">
                  <span class = "input-group-text">{name}</span>
                  <input type="text" class="form-control" value = {value}></input>
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
