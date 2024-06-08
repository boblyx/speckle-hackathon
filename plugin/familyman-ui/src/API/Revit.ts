/**
 * Revit.ts
 * For Revit API interactions
 */
function sendWebView2Msg(msg : any){
  let w = window as any;
  let wv2msg = msg;
  w.chome?.webview?.postMessage(wv2msg);
}

function getFamilies_Sort_Category(){
  console.log("Getting all families from Revit!");
  sendWebView2Msg({"action": "getFamilies_Sort_Category", "payload":{}});
}

function getFamilies_Of_Category(cat = "Doors"){
  console.log("Getting families from Revit!");
  let payload = {
    "category": cat
  }
  let wv2msg = {
    "action": "getFamiliesOfCategory", "payload": payload
  }
  sendWebView2Msg(wv2msg);
  // TODO:
  // Grab only family Revit UID and editable family parameters.
  // Check with the main model and find a match
}


