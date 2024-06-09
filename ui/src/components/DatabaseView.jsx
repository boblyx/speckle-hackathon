import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES, model, stream } from '../App';
import { FS_URL, speckleFetch, TOKEN } from '../speckle/SpeckleUtils';
import { dataPropertyFilter, FAMILYPROPERTIES, selectedTypeMark, setSelectedTypeMark } from './DataViewer';
import { v4 as uuidv4 } from 'uuid';
import { setSelApplicationId } from './AuditView';
import { commitQuery, streamQuery } from '../speckle/SpeckleQueries';


export const [selRow, setSelRow] = createSignal(null);
export const [selIfcGUID, setSelIfcGUID] = createSignal(null);
export const [selFamily, setSelFamily] = createSignal(null);

function getUniqueParameterNames(data) {
    const parameterNamesSet = new Set();

    for (const familyId in data.families) {
        const familyData = data.families[familyId];
        const parameters = familyData.parameters || {};
        for (const paramId in parameters) {
            const paramData = parameters[paramId];
            if (paramData && paramData.name) {
                parameterNamesSet.add(paramData.name);
            }
        }
    }

    return Array.from(parameterNamesSet);
}

export async function refreshDatabase(){
    const allCategoryCells_ = document.querySelectorAll('[data-view="database"][data-type="cell"][data-param="category"]');
    var allUUIDs = []
    allCategoryCells_.forEach(cell => {
        const param_ = cell.getAttribute('data-paramval')
        if (dataPropertyFilter()['categories'][param_]){
            allUUIDs.push(cell.getAttribute('data-uuid'));
        }
    })

    const allDataCells_ = document.querySelectorAll('[data-view="database"][data-type="cell"]');
    allDataCells_.forEach(cell => {
        const uuid_ = cell.getAttribute('data-uuid');
        if (allUUIDs.includes(uuid_)){
            cell.classList.remove('hidden');
        }
        else {
            cell.classList.add('hidden');
        }
    })
}

export async function updateDataViewer(data) {
    const dataKeys = Object.keys(data);
    const paramNameSet = getUniqueParameterNames(data);
    const tableDiv_ = document.getElementById('database-view-params');

    // Create the table and table header
    const table = document.createElement('table');
    table.classList.add('table-auto', 'w-full', 'border-collapse', 'divide-y-2');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    paramNameSet.unshift('Family');
    paramNameSet.unshift('Category');

    paramNameSet.forEach(param => {
        const th = document.createElement('th');
        th.id = `database-view-${param}-header`;
        th.innerHTML = param;
        th.classList.add('dataview-header', 'border', 'p-2');
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    for (const familyId in data.families) {
        const row = document.createElement('tr');
        row.setAttribute('data-type','row');
        row.setAttribute('data-view','database');
        row.setAttribute('data-uuid', uuidv4());
        const familyData = data.families[familyId];
        const parameters = familyData.parameters || {};
        let typeMark, ifcGUID;

        for (const paramId in parameters) {
            const paramData = parameters[paramId];
            if (paramData && 'name' in paramData) {
                if (paramData['name'] == "Type Mark"){
                    typeMark = paramData['value'];
                }
                if (paramData['name'] == "Type IfcGUID"){
                    ifcGUID = paramData['value'];
                }
            }
        }

        paramNameSet.forEach(param => {
            const td = document.createElement('td');
            td.className = 'data-cell border p-2';

            if (param == "Family") {
                td.id = `database-view-${familyId}-Family`;
                td.textContent = familyData['name'];
                td.setAttribute('data-paramval', familyData['name']);
                td.setAttribute('data-param', "family");
                td.setAttribute('data-typemark', typeMark);
                td.setAttribute('data-view', 'database');
                td.setAttribute('data-type', 'cell');
            } else if (param == "Category") {
                td.id = `database-view-${familyId}-Category`;
                td.textContent = familyData['category'];
                td.setAttribute('data-paramval', familyData['category']);
                td.setAttribute('data-param', "category");
                td.setAttribute('data-typemark', typeMark);
                td.setAttribute('data-view', 'database');
                td.setAttribute('data-type', 'cell');
            } else {
                let paramVal_;
                for (const paramId in parameters) {
                    const paramData = parameters[paramId];
                    if (param == paramData.name) {
                        paramVal_ = paramData.value;
                    }
                }
                td.id = `database-view-${familyId}-${param}`;
                td.textContent = paramVal_ ? paramVal_ : '-';
                td.setAttribute('data-paramval', paramVal_);
                td.setAttribute('data-param', param.toLowerCase());
                td.setAttribute('data-typemark', typeMark);
                td.setAttribute('data-view', 'database');
                td.setAttribute('data-type', 'cell');
            }

            td.addEventListener('click', e => {
                const parent = e.target.parentElement;

                if (selRow() == parent){
                    const allParentCells_ = document.querySelectorAll(`[data-type='row'][data-family="${parent.getAttribute('data-family')}"]`)
                    allParentCells_.forEach(parent => {
                        for (let cell of parent.children){
                            cell.classList.remove('selected');
                        }
                    })
                    setSelRow(null);
                    setSelFamily(null);
                    setSelApplicationId(null);
                }

                else {
                    if (selRow()){
                        const parentDataView_ = selRow().getAttribute('data-view');
                        if (parentDataView_ == 'database'){
                            const allParentCells_ = document.querySelectorAll(`[data-type='row'][data-family="${selRow().getAttribute('data-family')}"]`)
                            allParentCells_.forEach(parent => {
                                for (let cell of parent.children){
                                    cell.classList.remove('selected');
                                }
                            })
                        }

                        else if (parentDataView_ == 'audit'){
                            for (let cell of selRow().children){
                                cell.classList.remove('selected');
                            }
                        }
                    }
                    setSelRow(parent);
                    setSelFamily(parent.getAttribute('data-family'))
                    setSelApplicationId(null);
                    const allParentCells_ = document.querySelectorAll(`[data-type='row'][data-family="${selFamily()}"]`)
                    allParentCells_.forEach(parent => {
                        for (let cell of parent.children){
                            cell.classList.add('selected');
                        }
                    })

                }
                console.log("Selected Database Family: ", selFamily());
            });
            row.setAttribute('data-ifcguid', ifcGUID);
            row.setAttribute('data-family', familyData['name']);
            row.appendChild(td);
        });

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    tableDiv_.appendChild(table);
}


export async function retrieveDatabase(){
    try {
        if (model().name == 'main'){
            let token = localStorage.getItem(TOKEN);
            var streamRes = await speckleFetch(streamQuery(stream().id), token);
            var allModels = streamRes.data.stream.branches.items;
            var fullDatabaseJson = {
                families:{}
            }
            const targetPattern = /^main\/[^/]+$/;
            var models = []
            for (const item of allModels) {
              if (targetPattern.test(item.name)) {
                const commitsRes = await speckleFetch(commitQuery(stream().id, item.name), token);
                const allCommits = commitsRes.data.stream.branch.commits.items;
                if (!(item.id == 'fd0f03c834')){
                    models.push({name:item.name, id:item.id});
                }
              }
            }
            
            // Fetch and merge database for each model
            const fetchPromises = models.map(async (model_) => {
                var databaseRes = await fetch(
                `${FS_URL}/retrieve_database`,
                {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    stream: stream().id,
                    model: model_.id
                    })
                }
                );

                const databaseJson = await databaseRes.json();

                // Merge the databaseJson into fullDatabaseJson
                for (let familyId in databaseJson.families) {
                if (databaseJson.families.hasOwnProperty(familyId)) {
                    if (!fullDatabaseJson.families) {
                    fullDatabaseJson.families = {};
                    }
                    fullDatabaseJson.families[familyId] = databaseJson.families[familyId];
                }
                }
            });

            // Wait for all fetches to complete
            await Promise.all(fetchPromises);

            // Update the data viewer with the full database JSON
            await updateDataViewer(fullDatabaseJson);
        }

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
            <div id='database-view-params' class='flex flex-row divide-x-2'></div>
        </div>
      </div>
    );
  };
  
  export default DatabaseViewer;