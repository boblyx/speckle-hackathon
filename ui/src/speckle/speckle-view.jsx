import { createSignal, onMount } from "solid-js";
import { Viewer, DefaultViewerParams, SpeckleLoader } from "@speckle/viewer";
import { CameraController, MeasurementsExtension, SelectionExtension } from "@speckle/viewer";
import { SPECKLE_URL, TOKEN, speckleFetch } from "./SpeckleUtils";
import { modelName, streamId } from "../App";
import { commitQuery, streamQuery } from "./SpeckleQueries";

export const [speckleViewer, setSpeckleViewer] = createSignal(null);

export async function loadSpeckleURL(url, token){
  console.log("Loading model from: ", url)
  const loader = new SpeckleLoader(
    speckleViewer().getWorldTree(),
    url,
    token
  );
  await speckleViewer().loadObject(loader, 1, true);
}

// Loads model from stream id and commit id if user is logged in. Creates loader if no loader exists, or uses existing loader to load model.
export async function loadModel(){

  if (!streamId() || !modelName()){
    console.error("There is either no stream or model selected.")
    return
  }

  var modelFullName, allModels;
  // url = `${SPECKLE_URL}/projects/${streamId()}`
  let token = localStorage.getItem(TOKEN)
  if (token){
    switch (modelName()){
      case "Main":
        var streamRes = await speckleFetch(streamQuery(streamId()), token);
        allModels = streamRes.data.stream.branches.items;
        const targetPattern = /^main\/[^/]+$/;
        for (const item of allModels) {
          if (targetPattern.test(item.name)) {
            const commitsRes = await speckleFetch(commitQuery(streamId(), item.name), token);
            const allCommits = commitsRes.data.stream.branch.commits.items;
            const lastCommitRefObjId = allCommits[allCommits.length - 1]['referencedObject'];
            const model_url = `${SPECKLE_URL}/streams/${streamId()}/objects/${lastCommitRefObjId}`;
            await loadSpeckleURL(model_url, token);
          }
        }
        break;

      case null:
        console.error("There is no model chosen. Please select a model before loading.")
        return

      default:
        // Get model id from chosen name
        var streamRes = await speckleFetch(streamQuery(streamId()), token);
        allModels = streamRes.data.stream.branches.items;
        for (const item of allModels) {
          if (item.name === `main/${modelName()}`) {
            modelFullName = item.name;
          }
        }

        // Handle error if no matching model found.
        if (!modelFullName){
          console.error("There is no matching model.")
          return
        }

        const commitsRes = await speckleFetch(commitQuery(streamId(), modelFullName), token);
        const allCommits = commitsRes.data.stream.branch.commits.items;
        const lastCommitRefObjId = allCommits[allCommits.length - 1]['referencedObject'];
        const model_url = `${SPECKLE_URL}/streams/${streamId()}/objects/${lastCommitRefObjId}`;
        await loadSpeckleURL(model_url, token);
        break;
    }
    

  }

  else {
    console.warn("Not logged into Speckle!");
  }

}

async function initViewer() {
  /** Get the HTML container */
  const container = document.getElementById("speckle-viewer");

  /** Create Viewer instance */
  const viewer = new Viewer(container, DefaultViewerParams);
  setSpeckleViewer(viewer)
  /** Initialise the viewer */
  await speckleViewer().init();

  /** Add the stock camera controller extension */
  speckleViewer().createExtension(CameraController);

  /** Add the measurement tool */
  // viewer.createExtension(MeasurementsExtension);

  speckleViewer().createExtension(SelectionExtension);

}

function SpeckleViewer() {
  
  onMount(() => {
    initViewer()
  })

  return (
    <div className="z-0 w-2/5 h-full" id='speckle-viewer'></div>
  );
}

export default SpeckleViewer;
