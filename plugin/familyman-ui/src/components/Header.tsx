/**
 * Header.tsx
 * @author Bob Lee
 */
import type { Component } from 'solid-js';
import { Match, Switch, createSignal } from 'solid-js';
import * as bootstrap from 'bootstrap';
import {currentPage, setCurrentPage} from '../App';

export const [modelURL, setModelURL] = createSignal<string>("https://app.speckle.systems/projects/58ae34f884/models/87584774f1");

function updateModelURL(e : any){
  setModelURL(e.target.value);
}

const Header : Component = () => {
  return (
    <>
      <header class="bg-primary navbar navbar-expand-lg sticky-top min" style="min-height:90px;\
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19); \
        ">
        <div class = "row w-100">
          <Switch>
            <Match when = {currentPage() == "finder"}>
              <div class = "ms-4 mb-2 col-auto d-flex position-relative">
                <button id = "btn-refresh" class = "btn btn-primary border-primary-subtle bg-gradient border fs-2">
                  ⟳
                </button>
              </div>
              {/*
              <div class = "ms-2 mb-2 col-auto">
                <label for = "catfield" class = "text-light">Family Category:</label>
                <input id="catfield" class = "form-control" 
                  type="text" placeholder = "Doors"></input>
              </div>*/}
              <div class = "ms-2 col-6">
                <label for = "speckle model field" class = "text-light">Model URL: </label>
                <input id = "namefield" class = "form-control" 
                  type="text" placeholder = "https://app.speckle.systems/projects/.../models/..."
                  value = {modelURL()}
                  onkeyup={(e)=>{updateModelURL(e)}}
                ></input>
                  </div>
            </Match>
            <Match when = {currentPage() == "changer"}>

              <div class = "ms-4 mb-2 col-auto">
                <button class = "btn btn-primary border-primary-subtle \
                  bg-gradient border fs-2" id="back-btn"
                  onclick={()=>{setCurrentPage("finder")}}
                >🡠</button>
              </div>
            </Match>
          </Switch>
          <div class = "d-flex col text-light text-right position-relative me-4">
            <p class="position-absolute  top-50 translate-middle-y end-0 fs-2">FamilyMan</p>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header;
