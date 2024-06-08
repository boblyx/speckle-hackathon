import { onCleanup, onMount, createSignal, For } from 'solid-js';
import type { Component } from 'solid-js';
import {createStore} from 'solid-js/store';
import * as bootstrap from 'bootstrap';
import Header from './components/Header';
import { Family } from './FMan';
import FamilyCategoryList from './components/FamilyList';

export const [currentPage, setCurrentPage] = createSignal("finder");
export const [familyStore, setFamilyStore] = createStore({});
const egInData = {
    "Doors": [
      {
        "name" : "Timber Single Door 1000mm x 2000mm"
        ,"ftype" : "DT-SGL-100-200"
        ,"count": 100
      }
    ]
    ,"Windows": [
      {
        "name": "Panel Casement Glass Window 1000mm x 2000mm"
        ,"ftype": "XX-SGL-100-115"
        ,"count": 50
      }
    ]
}

const App: Component = () =>  {

  onMount(()=>{

    document.addEventListener("loadCategories", ()=>{
      // Populates search bar
    });

    document.addEventListener("loadFamilies", ()=>{

    });

    document.addEventListener("loadFamilyCards", ()=>{

    })

    // Load example families
    setFamilyStore(egInData);
  });

  return (
    <>
      <Header/>
      <div class = "m-4">
        <p> List candidate cards here.</p>
        <For each = {Object.keys(familyStore)}>
          {
            (key, i) => {
              console.log(key);
              return (
                <>
                  <FamilyCategoryList category={key} 
                  families = {familyStore[key]}/>
                </>
              )
            }
          }
        </For>
      </div>
    </>
  )
};

export default App;
