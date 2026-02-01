import { closeModal, showModal } from "./modalCtrl";
import swal from "sweetalert";

let allElementWithModalCambioRef = document.querySelectorAll<HTMLElement>(`[data-modal="modal-cambio"]`);
let modalSelectCambio = document.querySelector(".modal-cambio") as HTMLDivElement;
let containerListCambioBtn = modalSelectCambio?.querySelector(".list-cambio-container") as HTMLDivElement;
let allHeaderCambioSelectBtn = document.querySelectorAll<HTMLButtonElement>(".exchange-money .btn-exchange-money");

function actionsToOpenModalCambio(){
    allElementWithModalCambioRef?.forEach(elRefModal=>{
        elRefModal.addEventListener("click",()=>{
            let modalRef = showModal("modal-cambio");

            let cambioSelectedEl = allHeaderCambioSelectBtn[0].querySelector(".label-money") as HTMLElement;

            if(cambioSelectedEl){
                let currentCambioSelected = (cambioSelectedEl?.innerText??"PT").trim().toUpperCase();

                if(currentCambioSelected){
                    containerListCambioBtn.querySelector(".selected")?.classList.remove("selected");
                    containerListCambioBtn.querySelector(`[data-cambio="${currentCambioSelected}"]`)?.classList.add("selected");
                }
            }
        });
    });
}

function onCambioSelectInModal(){
    containerListCambioBtn?.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        let cambioSelected = "";

        if(elementClicked.classList.contains("btn-cambio-select")){
            cambioSelected = (elementClicked.dataset?.cambio??"").trim();
        }else{
            let btnCambioEl = elementClicked.closest(".btn-cambio-select") as HTMLElement;

            if(btnCambioEl){
                cambioSelected = (btnCambioEl.dataset?.cambio??"").trim();
            }
        }

        if(cambioSelected){
            //swal("Linga selecionado: "+langSelected);

            allHeaderCambioSelectBtn.forEach(btnEl=>{
                if(btnEl){
                    btnEl.querySelector<HTMLElement>(".label-money")!.innerText = cambioSelected;
                    closeModal(modalSelectCambio);
                }
            });
        }
    })
}

export function loadAllModalCambioFeatures(){
    actionsToOpenModalCambio();
    onCambioSelectInModal();
}