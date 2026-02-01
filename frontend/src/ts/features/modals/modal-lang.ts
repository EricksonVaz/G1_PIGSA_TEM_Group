import { closeModal, showModal } from "./modalCtrl";
import swal from "sweetalert";

let allElementWithModalLangRef = document.querySelectorAll<HTMLElement>(`[data-modal="modal-lang"]`);
let modalSelectLang = document.querySelector(".modal-lang") as HTMLDivElement;
let containerListLangBtn = modalSelectLang?.querySelector(".list-language-container") as HTMLDivElement;
let allHeaderLangSelectBtn = document.querySelectorAll<HTMLButtonElement>(".lang-select .btn-select-lang");

function actionsToOpenModalLang(){
    allElementWithModalLangRef?.forEach(elRefModal=>{
        elRefModal.addEventListener("click",()=>{
            let modalRef = showModal("modal-lang");

            let langSelectedEl = allHeaderLangSelectBtn[0].querySelector(".label-lang") as HTMLElement;

            if(langSelectedEl){
                let currentLangSelected = (langSelectedEl?.innerText??"PT").trim().toUpperCase();

                if(currentLangSelected){
                    containerListLangBtn.querySelector(".selected")?.classList.remove("selected");
                    containerListLangBtn.querySelector(`[data-lang="${currentLangSelected}"]`)?.classList.add("selected");
                }
            }
        });
    });
}

function onLangSelectInModal(){
    containerListLangBtn?.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        let langSelected = "";

        if(elementClicked.classList.contains("btn-lang-select")){
            langSelected = (elementClicked.dataset?.lang??"").trim();
        }else{
            let btnLangEl = elementClicked.closest(".btn-lang-select") as HTMLElement;

            if(btnLangEl){
                langSelected = (btnLangEl.dataset?.lang??"").trim();
            }
        }

        if(langSelected){
            //swal("Linga selecionado: "+langSelected);

            allHeaderLangSelectBtn.forEach(btnEl=>{
                if(btnEl){
                    btnEl.querySelector<HTMLElement>(".label-lang")!.innerText = langSelected;
                    closeModal(modalSelectLang);
                }
            });
        }
    })
}

export function loadAllModalLangFeatures(){
    actionsToOpenModalLang();
    onLangSelectInModal();
}