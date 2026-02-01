import { hideBackdrop, showBackDrop } from "../../components/backdrop";

export function showModal(idModal:string){
    let modalElem = document.querySelector(`#modal-${idModal}`) as HTMLDivElement;
    hideModals();
    showBackDrop();

    modalElem.classList.add("show");

    return modalElem;
}

export function hideModals(){
    let modalsOpen = document.querySelectorAll(".modal");

    hideBackdrop();

    modalsOpen.forEach((modal)=>{
        modal.classList.remove("show");
        modal.querySelector("form")?.reset();
    })
}