/**
 * App.tsx
 * @author Bob Lee
 */
import { onMount, createSignal, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import {createStore} from 'solid-js/store';
import Header from './components/Header';
import FamilyCategoryList from './components/FamilyList';
import {getFamilies_Sort_Category} from './API/Revit';

export const [currentPage, setCurrentPage] = createSignal("finder");
export const [familyStore, setFamilyStore] = createStore<any>({});
const egInData = {
    "Doors": {
      "abc":{
        "name" : "Timber Single Door 1000mm x 2000mm"
        ,"uuid": "abc"
        ,"ftype" : "DT-SGL-100-200"
        ,"count": 100
      }
    }
    ,"Windows": {
      "abcd":{
        "name": "Panel Casement Glass Window 1000mm x 2000mm"
        ,"ftype": "XX-SGL-100-115"
        ,"uuid": "abcd"
        ,"count": 50
      }
    }
}

const App: Component = () =>  {

  onMount(()=>{
    document.addEventListener("load-categories", (e : Event)=>{
      // Populates search bar
      const ev = e as CustomEvent;
      console.log(ev);
    });

    document.addEventListener("load-families", (e : Event)=>{
      const ev = e as CustomEvent;
      console.log(ev);
      for (let key of Object.keys(familyStore)){
        setFamilyStore(key, undefined);
      }
      setFamilyStore({});
      setFamilyStore(ev.detail);
    });

    // Load example families
    let revit_families = getFamilies_Sort_Category();
    setFamilyStore(egInData);
    //setFamilyStore(revit_families);

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
};

export default App;
