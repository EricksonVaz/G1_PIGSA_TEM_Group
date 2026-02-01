import { showModal } from "./modalCtrl";

let modalNameRef = "modal-video"


let allElementWithModalRef = document.querySelectorAll<HTMLElement>(`[data-modal="${modalNameRef}"]`);

function actionsToOpenModalRef(){
    allElementWithModalRef?.forEach(elRefModal=>{
        elRefModal.addEventListener("click",()=>{
            let modalRef = showModal(modalNameRef);
        });
    });
}

export function loadAllModalVideosFeatures(){
    actionsToOpenModalRef();
}