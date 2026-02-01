import { manageProctedFeatures } from "../utils/functions/Auth";
import { hideModals } from "../utils/functions/modals-ctrl";

export abstract class APage{
    private eventsArr:Function[] = [];
    protected static alreadyRendered = false;

    constructor(protected appDiv:HTMLDivElement,private template:string,private title:string = "CSU - Gestão de Reclamações"){}
     
    public render(){
        this.appDiv.innerHTML = "";
        this.appDiv.insertAdjacentHTML("beforeend",this.template!);

        window.document.title = this.title;
        
        if(!APage.alreadyRendered)this.loadCBEvents();

        APage.alreadyRendered = true;

        manageProctedFeatures();
    }

    protected addEvents(cb:Function){
        this.eventsArr.push(cb);
    }

    protected loadCBEvents(){
        this.appDiv.addEventListener("click",(e)=>{
            e.stopPropagation();
            let elementClicked = e.target as HTMLElement;

            for (const cb of this.eventsArr) {
                cb(elementClicked);
            }
        });
    }

    protected closeModalsOpem(elementClicked:HTMLElement){
        if(elementClicked.classList.contains("close-modal")){
            //let parentModal = elementClicked.closest("modal");

            hideModals();
            
        }
    }
}