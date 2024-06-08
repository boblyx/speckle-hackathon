import type { Component } from 'solid-js';
import { Match, Switch } from 'solid-js';
import * as bootstrap from 'bootstrap';
import {currentPage} from '../App';

const Header : Component = () => {
  return (
    <>
      <header class="bg-primary navbar navbar-expand-lg sticky-top min" style="min-height:90px;">
        <div class = "row w-100">
          <Switch>
            <Match when = {currentPage() == "finder"}>
              <div class = "ms-4 mb-2 col-auto">
                <label for = "catfield" class = "text-light">Family Category:</label>
                <input id="catfield" class = "form-control" 
                  type="text" placeholder = "Doors"></input>
              </div>
              <div class = "ms-4 col-auto">
                <label for = "namefield" class = "text-light">Family Name: </label>
                <input id = "namefield" class = "form-control" 
                  type="text" placeholder = "Single Timber Door"></input>
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
