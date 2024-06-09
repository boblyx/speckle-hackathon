/**
 * App.tsx
 * @author Bob Lee
 */
import { onMount, createSignal, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import {createStore} from 'solid-js/store';
import Header from './components/Header';
import Finder from './pages/Finder';
import {getFamilies_Sort_Category} from './API/Revit';
import Changer from './pages/Changer';
import * as _ from "lodash";

export const [currentPage, setCurrentPage] = createSignal("finder");
export const [familyStore, setFamilyStore] = createStore<any>({});
export const [parameterStore, setParameterStore] = createStore<any>();
export const [currentFamily, setCurrentFamily] = createSignal<any>();

export const [updatedFamilyCount, setUpdatedFamilyCount] = createSignal<number>(0);
export const [totalFamilyCount, setTotalFamilyCount] = createSignal<number>(0);

// FOR TESTING ONLY
const egInData = {
    "Doors": {
      "abc":{
        "name" : "Timber Single Door 1000mm x 2000mm"
        ,"uuid": "abc"
        ,"ftype" : "DT-SGL-100-200"
        ,"count": 100
        ,"parameters": {}
      }
    }
    ,"Windows": {
      "abcd":{
        "name": "Panel Casement Glass Window 1000mm x 2000mm"
        ,"ftype": "XX-SGL-100-115"
        ,"uuid": "abcd"
        ,"count": 50
        ,"parameters": {}
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
      setTotalFamilyCount(0);
      const ev = e as CustomEvent;
      console.log(ev);
      for (let key of Object.keys(familyStore)){
        setFamilyStore(key, undefined);
      }
      setFamilyStore({});
      setFamilyStore(ev.detail);
      for (let key of Object.keys(ev.detail)){
        let cat = ev.detail[key];
        for (let uid of Object.keys(cat)){
          setTotalFamilyCount(totalFamilyCount() + 1);
        }
      }
      console.log(`Families loaded: ${totalFamilyCount()}`);
    });

    document.addEventListener("load-parameters", (e : Event)=>{
      const ev = e as CustomEvent;
      console.log(ev);
      setParameterStore(ev.detail.parameters);
      // @ts-ignore
      let uuid = ev.detail.uuid;
      let stagedFamilies = _.cloneDeep({...familyStore});
      for (const key of Object.keys(stagedFamilies)){
        let familiesOfCat = stagedFamilies[key]
        if (!( uuid in familiesOfCat)) { continue }
        let familyType = familiesOfCat[uuid];
        familyType.parameters = ev.detail.parameters;
        setFamilyStore(key, familiesOfCat);
        setUpdatedFamilyCount(updatedFamilyCount() + 1);
        break;
      }
      console.log(familyStore);
      // update the parameter field in the familystore
    });

    // Load example families
    let revit_families = getFamilies_Sort_Category();
    setFamilyStore(egInData);
    //setFamilyStore(revit_families);

  });

  return (
    <>
      <Header/>
      <Show when={currentPage() === "finder"}>
        <Finder/>
      </Show>
      <Show when={currentPage() === "changer"}>
        <Changer/>
      </Show>
      <div data-bs-delay="10000" id = "toast-cont" class = "toast-container \
      position-fixed bottom-0 end-0 p-3"></div>
    </>
  )
};

export default App;
