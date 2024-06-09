import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES } from '../App';
import { FAMILYPROPERTIES } from './DataViewer';

export async function updateChangelog(){
  // 
}

const ChangelogView = () => {
    onMount(()=>{

    })

    return (
      <div id='dataviewer-changelog-view' class='flex flex-col w-full h-full bg-gray-400 p-5 hidden' data-view='changelog' data-type='dataview'>
        <div class='overflow-scroll bg-white flex flex-col divide-y-2 h-full'>
            <div id='changelog-view-params' class='flex flex-row divide-x-2'>
                <div class='dataview-header' id={`audit-view-source-header`}>Source</div>
                <For each={FAMILYPROPERTIES}>
                    {(prop) => (
                        <div id={`audit-view-${prop}`} class='flex flex-col divide-y-2 w-max'>
                            <div class='dataview-header' id={`audit-view-${prop}-header`}>{prop}</div>
                        </div>
                    )}
                </For>
            </div>
        </div>
      </div>
    );
  };
  
  export default ChangelogView;