import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES } from '../App';
import { FAMILYPROPERTIES } from './DataViewer';
import { loadedModels, speckleViewer } from '../speckle/speckle-view';
import { v4 as uuidv4 } from 'uuid';
import { selRow, setSelFamily, setSelIfcGUID, setSelRow } from './DatabaseView';

export const [selApplicationId, setSelApplicationId] = createSignal(null);

export async function updateAuditView() {
  const tableBody = document.getElementById('audit-view-tbody');
  tableBody.innerHTML = ''; // Clear previous rows

  const worldTree = speckleViewer().getWorldTree();

  var instanceNodes = worldTree.findAll((node) => {
    if (!node.model.raw.speckle_type) return;
    const rawModelData = node['model']['raw'];
    if ('definition' in rawModelData && rawModelData.speckle_type == "Objects.Other.Revit.RevitInstance") {
      const speckleId = rawModelData.id;

      const sourcePath = 'revitLinkedModelPath' in rawModelData ? rawModelData.revitLinkedModelPath : "-";
      const levelName = 'name' in rawModelData.level ? rawModelData.level.name : "-";
      const familyName = 'family' in rawModelData.definition ? rawModelData.definition.family : "-";
      const elemId = rawModelData.elementId;
      const typeName = 'type' in rawModelData.definition ? rawModelData.definition.type : "-";
      const appId = rawModelData.applicationId;

      var typeMark
      const params_ = rawModelData['parameters'];
      for (let paramId in params_) {
        const paramData_ = params_[paramId];
        if (typeof paramData_ == 'object' && paramData_ !== null){
          if (paramData_['name'] == 'Type Mark') {
            typeMark = paramData_['value'];
          }
        }
      }

      const row = document.createElement('tr');
      row.setAttribute('data-uuid','uuidv4()');
      row.setAttribute('data-type','row');
      row.setAttribute('data-view','audit');
      row.setAttribute('data-appId', appId);

      const createCell = (content, param) => {
        const cell = document.createElement('td');
        cell.className = 'data-cell border p-2';
        cell.textContent = content;
        cell.setAttribute('data-paramval', content);
        cell.setAttribute('data-param', param);
        cell.setAttribute('data-speckleid', speckleId);
        cell.setAttribute('data-view', 'audit');
        cell.setAttribute('data-type', 'cell');
        cell.addEventListener('click', e => {
          const parent = e.target.parentElement;

          if (selRow() == parent){
              for (let cell of parent.children){
                  cell.classList.remove('selected');
              }
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
              setSelFamily(null)
              setSelApplicationId(parent.getAttribute('data-appId'))
              for (let cell of parent.children){
                  cell.classList.add('selected');
              }
          }
        })
        return cell;
      };

      row.appendChild(createCell(sourcePath, 'source'));
      row.appendChild(createCell(levelName, 'level'));
      row.appendChild(createCell(elemId, 'elemid'));
      row.appendChild(createCell(familyName, 'family'));
      row.appendChild(createCell(typeName, 'type'));
      row.appendChild(createCell(typeMark, 'typemark'));
      row.appendChild(createCell(appId, 'appId'));

      tableBody.appendChild(row);
    }
  });
}

const AuditView = () => {
    onMount(()=>{
      
    })

    return (
      <div id='dataviewer-audit-view' class='flex flex-col w-full h-full bg-gray-300 p-5 hidden' data-view='audit' data-type='dataview'>
        <div class='overflow-scroll bg-white flex flex-col divide-y-2 h-full'>
          <div id='audit-view-params' class='flex flex-row divide-x-2'>
            <table id='audit-view-table' class='table-auto w-full border-collapse'>
              <thead>
                <tr>
                  <th class='dataview-header border-r-2'>SOURCE</th>
                  <th class='dataview-header border-r-2'>LEVEL</th>
                  <th class='dataview-header border-r-2'>ID</th>
                  <th class='dataview-header border-r-2'>FAMILY</th>
                  <th class='dataview-header border-r-2'>TYPE</th>
                  <th class='dataview-header border-r-2'>TYPEMARK</th>
                  <th class='dataview-header'>TYPE IFCGUID</th>
                </tr>
              </thead>
              <tbody id='audit-view-tbody'>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  export default AuditView;