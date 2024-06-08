/**
 * Finder.tsx
 * @author Bob Lee
 */

import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import { familyStore } from "../App";
import FamilyCategoryList from '../components/FamilyList';

const Finder : Component = () => {
  return (
      <div class = "m-4">
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
  )
}

export default Finder;
