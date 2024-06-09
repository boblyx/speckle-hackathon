/**
 * Finder.tsx
 * @author Bob Lee
 */

import type { Component } from "solid-js";
import { For, Show, createSignal } from "solid-js";
import { familyStore, setUpdatedFamilyCount, totalFamilyCount, updatedFamilyCount } from "../App";
import FamilyCategoryList from '../components/FamilyList';
import axios from "axios";
import {modelURL} from "../components/Header";
import { getParameters_Of_Uuid } from "../API/Revit";
import { cloneDeep } from "lodash";

const INIT_DB_URL = import.meta.env.VITE_API_URL + "/initialize_db";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * For admin only. Initializes family database
 */
async function initializeDB(){
  setUpdatedFamilyCount(0);
  for (const key of Object.keys(familyStore)){
    let familiesOfCat = familyStore[key];
    for (const uid of Object.keys(familiesOfCat)){
      //console.log(uid);
      getParameters_Of_Uuid(uid);
      await sleep(50);
    }
  }
  // It should be updated, may need another trigger to be sure
  
  let stagedFamilies = cloneDeep({...familyStore});
  let res = await axios({
    url: INIT_DB_URL,
    method: 'post',
    data: {
      speckle: modelURL()
      , families: stagedFamilies
    }
  });
  console.log(res);
}

const Finder : Component = () => {
  return (
    <>
      <div class = "m-4">
        <button class = "btn btn-primary" onclick = {()=>initializeDB()}> Initialize DB </button>
      </div>
      <div class = "m-4">
        <For each = {Object.keys(familyStore)}>
          {
            (key, i) => {
              return (
                <>
                  <Show when = {Object.keys(familyStore[key]).length > 0}>
                    <FamilyCategoryList category={key} 
                      families = {Object.values(familyStore[key])}/>
                  </Show>
                </>
              )
            }
          }
        </For>
      </div>
    </>
  )
}

export default Finder;
