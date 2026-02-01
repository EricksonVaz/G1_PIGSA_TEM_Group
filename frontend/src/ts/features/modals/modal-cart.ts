import { showModal } from "./modalCtrl";

let modalNameRef = "modal-cart"


let allElementWithModalRef = document.querySelectorAll<HTMLElement>(`[data-modal="${modalNameRef}"]`);

function actionsToOpenModalRef(){
    allElementWithModalRef?.forEach(elRefModal=>{
        elRefModal.addEventListener("click",()=>{
            let modalRef = showModal(modalNameRef);
        });
    });
}

export function loadAllModalCartFeatures(){
    actionsToOpenModalRef();
}