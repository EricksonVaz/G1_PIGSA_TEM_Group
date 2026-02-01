import { showModal } from "./modalCtrl";

let modalNameRef = "modal-terms"


let allElementWithModalRef = document.querySelectorAll<HTMLElement>(`[data-modal="${modalNameRef}"]`);

function actionsToOpenModalRef(){
    allElementWithModalRef?.forEach(elRefModal=>{
        elRefModal.addEventListener("click",()=>{
            let modalRef = showModal(modalNameRef);
        });
    });
}

export function loadAllModalTermsFeatures(){
    actionsToOpenModalRef();
}