/**
 * Revit.ts
 * For Revit API interactions
 */

function familiesOfCategory(cat = "Doors"){
  console.log("Getting families from Revit!");
  let w = window as any;
  let payload = {
    "category": cat
  }
  let wv2msg = {
    "action": "getFamilies", "payload": payload
  }
  w.chrome?.webview?.postMessage(wv2msg);
  // TODO:
  // Grab only family Revit UID and editable family parameters.
  // Check with the main model and find a match
}


