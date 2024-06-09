import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, onMount } from "solid-js";
import { FS_URL, TOKEN, getUserData, goToSpeckleAuthPage, speckleFetch, speckleLogOut } from './speckle/SpeckleUtils';
import { useNavigationGuard } from './speckle/NavigationGuard';
import SpeckleViewer, { filter, loadModel, speckleViewer } from './speckle/speckle-view';
import { queryAllStreams, streamQuery } from './speckle/SpeckleQueries';
import DataViewer, { dataView, selectedTypeMark } from './components/DataViewer';
import { FilteringExtension } from "@speckle/viewer";

export const [userData, setUserData] = createSignal(null);
export const [winlocation, setWinLocation] = createSignal(window.location.pathname)
export const [stream, setStream] = createSignal({id:"58ae34f884",name:"main"});
export const [model, setModel] = createSignal({id:"87584774f1",name:"0220_apartment tier 1"});
export const [selectedCategory, setSelectedCategory] = createSignal(null);


export const BIM_CATEGORIES = [
  'Door',
  'Wall',
  'Opaque Wall',
  'Column',
]

async function selectStream(e){
  const streamInput_ = document.getElementById('speckle-stream-input');
  const streamDropdown_ = document.getElementById('speckle-stream-dropdown');
  const streamButton_ = document.getElementById('speckle-stream-button');

  if (streamDropdown_.classList.contains('hidden')){
    console.log("Getting streams...");

    // hide model dropdown
    const modelDropdown_ = document.getElementById('speckle-model-dropdown');
    modelDropdown_.classList.add('hidden');

    streamDropdown_.replaceChildren();
    let token = localStorage.getItem(TOKEN);
    var res = await speckleFetch(queryAllStreams(), token);
    var streams = res.data.streams;
    var streamIds = streams.items;
  
    if (streamIds.length == 0){
        streamInput_.value = "No streams found. Create a stream!";
        return;
    }
    
    // Create UL element
    var streamUL = document.createElement('ul');
    streamUL.id = `speckle-stream-ul`;
    streamUL.setAttribute('class','unordered-list');
    streamDropdown_.appendChild(streamUL);
  
    for (let s=0; s<streamIds.length; s++){
        // console.log(`Obtained stream Id: ${streamIds[s].id}`)
        var id = streamIds[s].id;
        var streamQueryRes = await speckleFetch(streamQuery(id), token);
        
        // Populate dropdown
        var streamLi = document.createElement('li');
  
        var streamLabel = document.createElement('button');
        streamLabel.id = `speckle-stream-${id}`;
        streamLabel.setAttribute('stream-id', id);
        streamLabel.setAttribute('stream-name', streamQueryRes.data.stream.name);
        streamLabel.innerText = `Name: ${streamQueryRes.data.stream.name}, Id: ${id}`;
        streamLabel.setAttribute('class', 'list-item');
        streamLi.appendChild(streamLabel);
        streamUL.appendChild(streamLi);
  
        // Fill in default with first stream obtained
        if (s==0){
            streamInput_.value = streamQueryRes.data.stream.name;
            setStream({id:id, name:streamInput_.value});
        }
    }
  
    // Add click event listener for each stream found
    let streamULchildren = streamUL.children
    for (let s=0; s<streamULchildren.length; s++){
        let streamLabel = streamULchildren[s].firstChild
        streamLabel.addEventListener('click', async () => {
            streamInput_.value = streamLabel.getAttribute('stream-name');
            streamButton_.innerHTML = streamInput_.value;
            await setStream({id:streamLabel.getAttribute('stream-id'), name:streamLabel.getAttribute('stream-name')});
            streamDropdown_.classList.add('hidden');
        })
    }
  
    streamDropdown_.classList.remove('hidden')
  }

  else {
    streamDropdown_.classList.add('hidden')
  }
}

// Function to extract unique link model names from the models/branch list
function extractUniqueLinks(data) {
  const tierPattern = /main\/([^/]+)/;
  const uniqueTiers = new Map();

  data.forEach(branch => {
    const match = branch.name.match(tierPattern);
    if (match) {
      const name = match[1];
      // Use the name as the key to ensure uniqueness
      if (!uniqueTiers.has(name)) {
        uniqueTiers.set(name, { id: branch.id, name });
      }
    }
  });

  // Convert the Map values to an array
  return Array.from(uniqueTiers.values());
}

function extractMainModel(data){
  var mainModel;
  data.every(branch => {
    if (branch.name == "main"){
      mainModel = {id:branch.id, name:branch.name};
    }
  });
  return mainModel;
}

// Open dropdown which lists all the branches/models in the selected stream.
async function selectModel(e){
  if (stream()){
    console.log("Getting models...")
    const inputDiv = document.getElementById('speckle-model-input');
    const dropdownDiv = document.getElementById('speckle-model-dropdown');
    const button_ = document.getElementById('speckle-model-button');

    if (dropdownDiv.classList.contains('hidden')){
      // Hide stream dropdown
      const streamDropDown_ = document.getElementById('speckle-stream-dropdown');
      streamDropDown_.classList.add('hidden');

      dropdownDiv.replaceChildren();
      let token = localStorage.getItem(TOKEN);
      var res = await speckleFetch(streamQuery(stream().id), token);
      var branches = res.data.stream.branches.items
      if (branches.length == 0){
          inputDiv.value = "No branches found. Something is wrong..."
          return
      }

      const mainModel = extractMainModel(branches)
      const uniqueLinks = extractUniqueLinks(branches);
      // Create UL element
      var unorderedList = document.createElement('ul');
      unorderedList.id = `speckle-model-ul`;
      unorderedList.setAttribute('class','unordered-list');
      dropdownDiv.appendChild(unorderedList);
  
      // Hard coding main model option in drop down
      var list_ = document.createElement('li')

      var label_ = document.createElement('button')
      label_.id = `speckle-model-main`
      label_.setAttribute('model-name', 'main')
      label_.setAttribute('model-id', mainModel.id)
      console.log(mainModel.id)
      label_.innerText = 'main'
      label_.setAttribute('class', 'list-item text-left')
      list_.appendChild(label_)
      unorderedList.appendChild(list_)
  
      
      for (let l=0; l<uniqueLinks.length; l++){
        var link = uniqueLinks[l]
        // console.log(`Obtained branch Id: ${branch.id}`)
        // Populate dropdown
        var list_ = document.createElement('li')
  
        var label_ = document.createElement('button')
        label_.id = `speckle-model-${link.name}`
        label_.setAttribute('model-name', link.name)
        label_.setAttribute('model-id', link.id)
        label_.innerText = link.name
        label_.setAttribute('class', 'list-item text-left')
        list_.appendChild(label_)
        unorderedList.appendChild(list_)
      }
  
      // Add click event listener for each stream found
      let unorderedListChildren = unorderedList.children
      for (let c=0; c<unorderedListChildren.length; c++){
          let label_ = unorderedListChildren[c].firstChild
          label_.addEventListener('click', async () => {
              inputDiv.value = label_.getAttribute('model-name');
              button_.innerHTML = inputDiv.value;
              await setModel({id:label_.getAttribute('model-id'), name:label_.getAttribute('model-name')});
              dropdownDiv.classList.add('hidden');
          })
      }
      dropdownDiv.classList.remove('hidden');
    }

    else {
      dropdownDiv.classList.add('hidden');
    }

  }
  else {
    console.error("No stream selected. Please select a stream first.")
  }
}

// Open BIM category dropdown list
async function openBIMCategoryDropdown(){
  console.log("Listing BIM categories...")
  const inputDiv = document.getElementById('speckle-bimcategory-input')
  const dropdownDiv = document.getElementById('speckle-bimcategory-dropdown')
  dropdownDiv.classList.remove('hidden')
}

// Update BIM category selection
async function selectBIMCategory(e){
  const inputDiv = document.getElementById('speckle-bimcategory-input')
  const button_ = document.getElementById('speckle-bimcategory-button')
  const dropdownDiv = document.getElementById('speckle-bimcategory-dropdown')

  const category_ = e.target.getAttribute('data-category')

  inputDiv.value = category_
  button_.innerHTML = category_
  setSelectedCategory(category_)
  dropdownDiv.classList.add('hidden')
}

async function refreshLog(e){

}

async function updateRendering(){
  const worldTree = speckleViewer().getWorldTree();
  const renderTree = worldTree.getRenderTree();

  var familyTypeNodes = worldTree.findAll((node) => {
    if (!node.model.raw.speckle_type) return;
    const rawModelData = node['model']['raw'];
    const category = rawModelData['category'];
    if (category=='Doors'){
      if ('definition' in rawModelData){
        const familyName = rawModelData['definition']['family']
        if (familyName == "MLD_DOR_Timber_Double"){
          return node;
        }
      }
    }
  })

  const filteringState = filter().isolateObjects(
    familyTypeNodes.map((node) => node.model.id)
  )
}

function App() {
  
  onMount(async () => {
    await useNavigationGuard(winlocation());
    const data = await getUserData();
    setUserData(data);
    
    // DEBUGGING
    await loadModel();
    await updateRendering();
  })

  return (
    <div className="flex flex-col w-screen h-screen place-items-center relative overflow-hidden" id='main'>
      {/* NAV BAR START */}
      <div id='nav-bar' className='z-10 flex w-full h-16 max-h-16 bg-blue-700 p-3 justify-between overflow-visible'>
        { !userData() ? // If user data is null show login prompt
          <div className='flex flex-col place-items-center overflow-visible max-h-16'>
            <button id='navbar-speckle-login' className='basic-text' onClick={()=> goToSpeckleAuthPage() }>Login</button>
          </div>
          :
          <div className='flex flex-row gap-x-5 place-items-center overflow-visible max-h-16'>
            <button id='navbar-speckle-logout' class='basic-text' onClick={()=> speckleLogOut() }>Logout</button>
            <div id='navbar-speckle-user' class='text-white font-medium text-2xl'> {userData().data.activeUser.name} </div>

            <div id='whitespace' class='w-24 h-1'></div>

            <div id='navbar-speckle-select' class='flex flex-row gap-x-16 overflow-visible max-h-16'>
              <div id='navbar-speckle-stream-select' class='w-64 relative'>
                <button onclick={selectStream} id='speckle-stream-button' class='basic-text text-center w-full' >Select Stream</button>
                <input type='text' id='speckle-stream-input' placeholder="" hidden></input>
                <div id='speckle-stream-dropdown' class='dropdown hidden'></div>
              </div>

              <div id='navbar-speckle-model-select' class='w-64 relative'>
                <button onclick={selectModel} id='speckle-model-button' class='basic-text text-center w-full' >Select Model</button>
                <input type='text' id='speckle-model-input' placeholder="" hidden></input>
                <div id='speckle-model-dropdown' class='dropdown hidden'></div>
              </div>

            </div>

            <button id='navbar-speckle-load-model' className='basic-text' onClick={loadModel}>Load Model</button>
            <button id='navbar-speckle-refresh-log' className='basic-text' onClick={refreshLog}>Refresh Log</button>
            {/* <button id='navbar-speckle-debug' className='basic-text' onClick={refreshLog}>Debug</button> */}
          </div>
          }
      </div>
      {/* NAV BAR END */}
      
      {/* DISPLAY LOG START */}
      <div id="logs-viewer-container" class='flex flex-row h-full w-full'>
          <SpeckleViewer/>
          <DataViewer/>
      </div>
      {/* DISPLAY LOG END */}

    </div>
  );
}

export default App;
