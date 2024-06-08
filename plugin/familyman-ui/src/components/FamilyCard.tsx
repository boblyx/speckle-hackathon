/**
 * FamilyCard.tsx
 * @author Bob Lee
 */

import { onMount, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { setCurrentPage } from '../App';
import { Family } from '../FMan';
import { setCurrentFamily } from '../App';
import {getParameters_Of_Uuid} from '../API/Revit';

function editParam(family : Family){
  // Get all params of FamilySymbol
  //getParameters_Of_Uuid(family.uuid);
  setCurrentFamily(family);
  // Change page
  setCurrentPage("changer");
}

const FamilyCard : Component<{ family : Family
                            }> = (props) => {
  return(
    <>
      <div class = "card mb-2">
        <div class = "card-body">
          <div class = "row">
            <div class = "col-auto">
              <h4>{props.family.name}</h4>
              <h5>{props.family.ftype}</h5>
              {/*<h6 class = "fs-7 text-secondary">Count: {props.family.count}</h6>*/}
            </div>
            <div class = "d-flex col position-relative align-items-end">
              <button onclick={()=>{ editParam(props.family) }} class = "fs-3 btn btn-primary position-absolute \
                top-50 translate-middle-y end-0 me-4">Change</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 
export default FamilyCard;
