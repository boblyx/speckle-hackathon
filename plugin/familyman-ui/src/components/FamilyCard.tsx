import { onMount, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { setCurrentPage } from '../App';
import { Family } from '../FMan';


const FamilyCard : Component<{ family : Family
                            }> = (props) => {
  return(
    <>
      <div class = "card">
        <div class = "card-body">
          <div class = "row">
            <div class = "col-auto">
              {/*
              <h4>Timber Single Door 1000mm x 2000mm</h4>
              <h5>DT-SGL-100-200</h5>*/}
              <h4>{props.family.name}</h4>
              <h5>{props.family.ftype}</h5>
              <h6 class = "fs-7 text-secondary">Count: {props.family.count}</h6>
            </div>
            <div class = "d-flex col position-relative align-items-end">
              <button class = "fs-3 btn btn-primary position-absolute \
                top-50 translate-middle-y end-0 me-4">Change</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 
export default FamilyCard;
