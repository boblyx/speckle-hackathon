/**
 * Toast.ts
 *
 * Fires a toast notification 
 * @author Bob Lee
 */
import * as bootstrap from 'bootstrap';
export class Toast{
  
  header : string
  image : string
  contents: string
  html : HTMLDivElement

  constructor(header = "Header", image = "", contents = ""){
    this.header = header;
    this.image = image;
    this.contents = contents;
    this.html = document.createElement("div");
    this.html.classList.add(...["toast"])
    this.html.setAttribute("aria-live", "assertive");
    this.html.setAttribute("aria-atomic", "true");
    this.html.innerHTML = `
        <div class = "toast-header">
          <strong class = "me-auto">${this.header}</strong>
          <button type = "button" class = "btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class = "toast-body">
          ${contents}
        </div>
      `;
    this.html.addEventListener('hidden.bs.toast', ()=>{
      this.html.remove();
    }); 
    let toastcont = document.getElementById("toast-cont");
    toastcont.appendChild(this.html);
  }
  show(){
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.html);
    toastBootstrap.show();
  }
}
