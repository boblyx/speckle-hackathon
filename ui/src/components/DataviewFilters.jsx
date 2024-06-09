import { createSignal, For, onMount, Show } from 'solid-js';
import CategoryFilter from './CategoryFilter';
import SourceFilter from './SourceFilter';

export async function toggleFilterList(e){
    if (e.target.getAttribute('data-type') != 'filter'){return}
    const filterType = e.target.getAttribute('data-filter');
    const filterContainer_ = document.querySelector(`[data-type="container"][data-filter="${filterType}"]`);
    if (filterContainer_.classList.contains('hidden')){
        filterContainer_.classList.remove('hidden');
    }
    else {
        filterContainer_.classList.add('hidden');
    }
}

const DataviewFilters = () => {
    onMount(()=>{

    })

    return (
      <div id='dataviewer-filters' class='flex flex-row items-center gap-x-2'>
        <CategoryFilter/>
        <SourceFilter/>
       </div>
    );
  };
  
  export default DataviewFilters;