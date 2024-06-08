import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES } from '../App';



const PropertyViewer = () => {
    onMount(()=>{
        setDataPropertyFilter(new DataPropertyFilter());
    })

    return (
      <div id='dataviewer-property-view' class='flex flex-col w-full h-full bg-gray-200 p-5'>
        <div class='overflow-scroll bg-white flex flex-col divide-y-2 h-full'>
            <div id='property-view-params' class='flex flex-row divide-x-2'>
                <For each={FAMILYPROPERTIES}>
                {(prop) => (
                    <div class='data-cell' id={`property-view-${prop}`}>{prop}</div>
                )}
                </For>
            </div>
        </div>
      </div>
    );
  };
  
  export default PropertyViewer;