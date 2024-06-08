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

export const [currentPage, setCurrentPage] = createSignal("finder");
export const [familyStore, setFamilyStore] = createStore<any>({});
export const [parameterStore, setParameterStore] = createStore<any>();
export const [currentFamily, setCurrentFamily] = createSignal<any>();

// FOR TESTING ONLY
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

const egParamData = {}

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
      <Finder/>
    </>
  )
};

export default App;
