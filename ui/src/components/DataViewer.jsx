import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES } from '../App';
import filterIcon from '../assets/filter.png';
import DatabaseViewer, { retrieveDatabase, updateDataViewer } from './DatabaseView';

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

// Function to toggle category filter
function toggleCategoryFilter(event) {
    const category = event.target.getAttribute('data-category');
    dataPropertyFilter()[category] = !dataPropertyFilter()[category];
    retrieveDatabase();
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

        {/* FILTERS */}
        <div id='dataviewer-filters' class='flex flex-row items-center gap-x-2'>
            <div id='dataviewer-filters-category' class='filter-category-container'>
                <label>Category</label>
                <img id='dataviewer-filters-category-icon' 
                    class='icon-s object-contain cursor-pointer'
                    src={filterIcon}
                    onclick={(e) => {
                        const propFilterContainer = document.getElementById(`property-category-container`);
                        const propFilterContainerClasses = propFilterContainer.classList;
                        if (propFilterContainerClasses.contains('hidden')){
                            propFilterContainerClasses.remove('hidden');
                        }
                        else {
                            propFilterContainerClasses.add('hidden');
                        }
                    }}>
                </img>
                <div id='property-category-container' class='flex flex-col dropdown hidden overflow-scoll top-full left-0 border-2 rounded-lg bg-white mt-3'  data-type='filter-container'>
                    <For each={BIM_CATEGORIES}>
                        {(cat) => (
                            <div id={`category-${cat}-container`} class='flex flex-row px-3 py-2 items-center justify-between gap-x-3 min-w-full w-max border-b-2'>
                                <label id={`property-${cat}-label`} class='font-medium text-gray-800 text-center'>{cat}</label>
                                <input type='checkbox'
                                        checked
                                        id={`category-${cat}-checkbox`} 
                                        class='w-4 h-4 border-gray-300 bg-gray-100 rounded' 
                                        data-category={cat}
                                        onclick={toggleCategoryFilter}>
                                </input>

                            </div>
                        )}
                    </For>
                </div>

            </div>
        </div>
        {/* FILTERS */}


        {/* MODES */}
        <div id='dataviewer-mode-switch' class='flex flex-row' style='height:5%;'>
            <button id='dataviewer-database' class='w-1/2 bg-gray-200 font-medium text-lg'>Database</button>
            <button id='dataviewer-audit' class='w-1/2 bg-gray-300 font-medium text-lg'>Audit</button>
        </div>
        <div id='dataviewer-mode-view' style='height:80%;'>
            <DatabaseViewer/>
        </div>
        {/* MODES */}

      </div>
    );
  };
  
  export default DataViewer;