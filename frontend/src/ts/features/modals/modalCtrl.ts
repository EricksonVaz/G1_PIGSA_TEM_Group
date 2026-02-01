
let backdropModal = document.querySelector(".backdrop") as HTMLDivElement;

export function showModal(modalRef:string){
    let modalFind = document.querySelector("#"+modalRef) as HTMLDivElement;

    if(modalFind){
        showBackDrop();
        modalFind.classList.add("show");
    }

    return modalFind;
}

export function closeModal(modalElement?:HTMLDivElement){
    let modalFind = document.querySelector(".modal.show") as HTMLDivElement;

    hideBackDrop();
    if(modalElement){
        modalElement.classList.remove("show");
    }else{
        modalFind?.classList.remove("show");
    }
}

export function AddGlobalOnClose(){
    let allModalCloseBtns = document.querySelectorAll<HTMLSpanElement>(".btn-close-modal");

    allModalCloseBtns.forEach(btnCloseModal=>{
        btnCloseModal.addEventListener("click",()=>{
            let modalParent = btnCloseModal.closest<HTMLDivElement>(".modal");

            if(modalParent)closeModal(modalParent);
        });
    });
}

export function showBackDrop(){
    backdropModal?.classList.add("show");
}

export function hideBackDrop(){
    backdropModal?.classList.remove("show");
}

export function directLinkFormOpenCtrl(){
    let hasDetect = (window.location?.hash ?? "").trim().toLowerCase();

    if(hasDetect== "#reclamacao"){
        (document.querySelector(`[data-modal="modal-reclama"]`) as HTMLAnchorElement)?.click();
    }

    if(hasDetect=="#denuncia"){
        (document.querySelector(`[data-modal="modal-denuncia"]`) as HTMLAnchorElement)?.click();
    }
}