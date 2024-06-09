import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES } from '../App';
import DatabaseViewer, { retrieveDatabase, updateDataViewer } from './DatabaseView';
import AuditView from './AuditView';
import ChangelogView from './ChangelogView';
import DataviewFilters from './DataviewFilters';

export const [selectedCategory, setSelectedCategory] = createSignal('');
export const [dataView, setDataView] = createSignal('database');
export const [dataPropertyFilter, setDataPropertyFilter] = createSignal(null);
export const [selectedTypeMark, setSelectedTypeMark] = createSignal(null);

export const FAMILYPROPERTIES = [
    'category',
    'category_description',
    'family',
    'material',
    'material_description',
    'panel_number',
    'panel_number_description',
    'size_width',
    'size_width_calculation',
    'size_height',
    'size_height_calculation',
    'type_comment',
    'description',
    'type_mark',
    'type_name',
    'filepath',
]

export class DataPropertyFilter {
    constructor() {
      BIM_CATEGORIES.forEach(category => {
        this[category] = true;
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