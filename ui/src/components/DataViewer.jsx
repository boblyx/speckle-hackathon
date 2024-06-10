import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES } from '../App';
import DatabaseViewer, { retrieveDatabase, updateDataViewer } from './DatabaseView';
import AuditView from './AuditView';
import ChangelogView from './ChangelogView';
import DataviewFilters from './DataviewFilters';

export const [selectedCategory, setSelectedCategory] = createSignal('');
export const [dataView, setDataView] = createSignal('audit');
export const [dataPropertyFilter, setDataPropertyFilter] = createSignal(null);
export const [selectedTypeMark, setSelectedTypeMark] = createSignal("700_2200.DL.01.125");

export const FAMILYPROPERTIES = [
'Type Mark', 'Height', 'Width', 'Rough Width', 'Rough Height', 'Edited by', 'Thickness', 'DOR_Acoustics', 'DOR_DoorType', 'DOR_FrameMaterial', 'DOR_LeafMaterial', 'DOR_NumberOfLeaves', 'Frame Width', 'Architrave Width',
'Architrave Thickness', 'Architrave Offset', 'Leaf Thickness', 'Leaf Width', 'Hardware Offset', 'Hardware Height', 'Door Panel', 'Frame', 'Handle', 'DOR_Originator', 
'DOR_TypeOfOperation', 'Analytic Construction', 'Define Thermal Properties by', 'Visual Light Transmittance', 'Solar Heat Gain Coefficient', 'Thermal Resistance (R)', 
'Heat Transfer Coefficient (U)', 'Export Type to IFC As', 'Operation', 'Type IFC Predefined Type', 'Export Type to IFC', 'Type IfcGUID', 'Function', 'Wall Closure',
'Construction Type', 'Assembly Code', 'Type Image', 'Keynote', 'Model', 'Manufacturer', 'Type Comments', 'URL', 'Description', 'Fire Rating', 'Cost', 
'Assembly Description', 'Workset', 'OmniClass Number', 'OmniClass Title', 'Code Name', 'Filepath'
]

export class DataPropertyFilter {
    constructor() {
      this.categories = {}
      this.sources = {}
      this.levels = {}
      BIM_CATEGORIES.forEach(category => {
        this["categories"][category] = true;
      });
    }
}

export async function updateDataView(){
    const dataViews = document.querySelectorAll('[data-type="dataview"]');
    dataViews.forEach(viewNode => {
        const viewType = viewNode.getAttribute('data-view');
        if (viewType != dataView()){
            viewNode.classList.add('hidden');
        }
        else {
            viewNode.classList.remove('hidden');
        }
    })
}

const DataViewer = () => {
    
    onMount(() => {
        setDataPropertyFilter(new DataPropertyFilter());
        updateDataView();
    })

    return (
      <div id='dataviewer' class='flex flex-col w-3/5 h-full overflow-hidden'>

        <DataviewFilters/>

        {/* MODES */}
        <div id='dataviewer-mode-switch' class='flex flex-row' style='height:5%;'>
            <button onclick={() => {setDataView('database'); updateDataView()}} id='dataviewer-database' class='dataviewer-header bg-gray-200' data-view='database'>Database</button>
            <button onclick={() => {setDataView('audit'); updateDataView()}} id='dataviewer-audit' class='dataviewer-header bg-gray-300' data-view='audit'>Audit</button>
            <button onclick={() => {setDataView('changelog'); updateDataView()}} id='dataviewer-changelog' class='dataviewer-header bg-gray-400' data-view='changelog'>Change Log</button>
        </div>
        <div id='dataviewer-mode-view' style='height:80%;'>
            <DatabaseViewer/>
            <AuditView/>
            <ChangelogView/>
        </div>
        {/* MODES */}

      </div>
    );
  };
  
  export default DataViewer;