import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES } from '../App';
import { FAMILYPROPERTIES } from './DataViewer';

export async function updateAuditView(){
  // 
}

const AuditView = () => {
    onMount(()=>{

    })

    return (
      <div id='dataviewer-audit-view' class='flex flex-col w-full h-full bg-gray-300 p-5 hidden' data-view='audit' data-type='dataview'>
        <div class='overflow-scroll bg-white flex flex-col divide-y-2 h-full'>
            <div id='audit-view-params' class='flex flex-row divide-x-2'>
                <div class='dataview-header' id={`audit-view-source-header`}>Source</div>
                <div class='dataview-header' id={`audit-view-level-header`}>Level</div>
                <div class='dataview-header' id={`audit-view-level-header`}>Id</div>
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
  
  export default AuditView;