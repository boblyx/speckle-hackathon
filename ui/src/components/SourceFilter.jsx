import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES, model } from '../App';
import filterIcon from '../assets/filter.png';
import { toggleFilterList } from './DataviewFilters';

async function toggleSourceFilter(){
    const filterContainer_ = document.getElementById('dataviewer-filters-source');
    const filterBtn_ = document.querySelector('[data-type="filter"][data-filter="source"]');
    if (!model()){
        filterContainer_.classList.add('disabled');
        filterBtn_.classList.remove('cursor-pointer');
        filterBtn_.removeEventListener('click', toggleFilterList);
    }
    else if (model().name == "main"){
        filterContainer_.classList.remove('disabled');
        filterBtn_.classList.add('cursor-pointer');
        filterBtn_.addEventListener('click', toggleFilterList);
    }

    else {
        filterContainer_.classList.add('disabled');
        filterBtn_.classList.remove('cursor-pointer');
        filterBtn_.removeEventListener('click', toggleFilterList);
    }
}



const SourceFilter = () => {
    onMount(()=>{
        toggleSourceFilter()
    })

    return (
        <div id='dataviewer-filters-source' class='filter-container' data-type='container' data-filter='source'>
            <label>Source</label>
            <img id='dataviewer-filters-source-icon' 
                class='icon-s object-contain cursor-pointer'
                src={filterIcon}
                onclick={toggleFilterList}
                data-type='filter'
                data-filter='source'>
            </img>
            <div id='property-source-container' class='flex flex-col dropdown hidden overflow-scoll top-full left-0 border-2 rounded-lg bg-white mt-3' data-type='container' data-filter='category'>
            </div>
        </div>
    );
  };
  
  export default SourceFilter;