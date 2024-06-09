import { createSignal, For, onMount, Show } from 'solid-js';
import { BIM_CATEGORIES } from '../App';
import filterIcon from '../assets/filter.png';
import { toggleFilterList } from './DataviewFilters';

// Function to toggle category filter
function toggleCategoryFilter(event) {
    const category = event.target.getAttribute('data-category');
    dataPropertyFilter()[category] = !dataPropertyFilter()[category];
    // CHANGE TO UPDATE THE DIVS ONLY, DONT RETRIEVE AGAIN
    // retrieveDatabase();
}

const CategoryFilter = () => {
    onMount(()=>{

    })

    return (
        <div id='dataviewer-filters-category' class='filter-container'>
            <label>Category</label>
            <img id='dataviewer-filters-category-icon' 
                class='icon-s object-contain cursor-pointer'
                src={filterIcon}
                onclick={toggleFilterList}
                data-type='filter'
                data-filter='category'>
            </img>
            <div id='property-category-container' class='flex flex-col dropdown hidden overflow-scoll top-full left-0 border-2 rounded-lg bg-white mt-3' data-type='container' data-filter='category'>
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
    );
  };
  
  export default CategoryFilter;