import { onCleanup, onMount, createSignal, For } from 'solid-js';
import type { Component } from 'solid-js';
import * as bootstrap from 'bootstrap';
import { Family } from '../FMan';

import FamilyCard from './FamilyCard';

function deserializeFamily(obj : {
                           name : string, 
                           ftype : string, 
                           count : number
}){
  return new Family(obj.name, obj.ftype, obj.count)
}

const FamilyCategoryList : Component<{category : string, 
  families : {name : string, ftype: string, count: number}[]}> = (props) => {

  return (

    <>
      <details class = "mb-4" open>
        <summary class="fs-2 mb-2 text-primary">
          {props.category}
        </summary>
        <For each={props.families}>
          {
            (familyObject, i)=>{
              let family = deserializeFamily(familyObject);
              return (
                <>
                  <FamilyCard family = {family}/>
                </>
              )
            }
          }
        </For>
      </details>
    </>
  )
}

export default FamilyCategoryList;
