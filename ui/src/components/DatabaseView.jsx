import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES } from '../App';
import { FS_URL } from '../speckle/SpeckleUtils';
import { dataPropertyFilter, FAMILYPROPERTIES, selectedTypeMark, setSelectedTypeMark } from './DataViewer';

export async function updateDataViewer(data) {
    const dataKeys = Object.keys(data);

    FAMILYPROPERTIES.forEach(prop => {
        // Get the column div for each property
        const columnDiv = document.getElementById(`database-view-${prop}`);
        if (columnDiv) {
            // Clear existing content except the header
            const header = columnDiv.querySelector(`#database-view-${prop}-header`);
            columnDiv.innerHTML = '';
            columnDiv.appendChild(header);

            // Append the data cells
            dataKeys.forEach(key => {
                if (dataPropertyFilter()[data[key]['category_description']]){
                    const dataCell = document.createElement('div');
                    dataCell.className = 'data-cell';
                    dataCell.id = `database-view-${prop}-${key}`;
                    dataCell.textContent = data[key][prop] || '';
                    dataCell.setAttribute('data-prop',prop);
                    dataCell.setAttribute('data-typemark', data[key]['type_mark'])
                    dataCell.setAttribute('data-view', 'database')
                    dataCell.setAttribute('data-type', 'cell')
                    dataCell.addEventListener('click', (e) => {
                        const target_ = e.target;
                        const type_mark = target_.getAttribute('data-typemark');
                        setSelectedTypeMark(type_mark);
                        const typemarkDivs = document.querySelectorAll('[data-view="database"][data-type="cell"]');
                        typemarkDivs.forEach(child => {
                            const childTypeMark = child.getAttribute('data-typemark');
                            if (childTypeMark != selectedTypeMark()){
                                child.classList.remove('selected');
                            }
                            else {
                                child.classList.add('selected');
                            }
                        })
                    })
                    columnDiv.appendChild(dataCell);
                }
            });
        }
    });
}

export async function retrieveDatabase(){
    try {
        var databaseRes = await fetch(
            `${FS_URL}/retrieve_database`,
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
            }
        )
        const databaseJson = await databaseRes.json();
        await updateDataViewer(databaseJson);
    }

    catch (err) {
        console.error("API call failed ", err)
    }

}

const DatabaseViewer = () => {
    onMount(async ()=>{
        const data_ = await retrieveDatabase()
    })

    return (
      <div id='dataviewer-database-view' class='flex flex-col w-full h-full bg-gray-200 p-5 hidden' data-view='database' data-type='dataview'>
        <div class='overflow-scroll bg-white flex flex-col divide-y-2 h-full'>
            <div id='database-view-params' class='flex flex-row divide-x-2'>
                <For each={FAMILYPROPERTIES}>
                    {(prop) => (
                        <div id={`database-view-${prop}`} class='flex flex-col divide-y-2 w-max'>
                            <div class='px-3 py-2 font-medium min-h-10 max-h-10 min-w-max' id={`database-view-${prop}-header`}>{prop}</div>
                        </div>
                    )}
                </For>
            </div>
        </div>
      </div>
    );
  };
  
  export default DatabaseViewer;