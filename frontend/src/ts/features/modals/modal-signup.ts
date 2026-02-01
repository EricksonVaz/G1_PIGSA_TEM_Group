import { openModalLoginSingUP } from "./modal-login-signup";
import { showModal } from "./modalCtrl";

let modalNameRef = "modal-signup"

let modalSignup = document.querySelector(".modal-signup") as HTMLDivElement;
let btnCloseModalSignUp = modalSignup?.querySelector(".btn-close-modal") as HTMLElement;


//let allElementWithModalRef = document.querySelectorAll<HTMLElement>(`[data-modal="${modalNameRef}"]`);

// function actionsToOpenModalRef(){
//     allElementWithModalRef.forEach(elRefModal=>{
//         elRefModal.addEventListener("click",()=>{
//             let modalRef = showModal(modalNameRef);
//         });
//     });
// }

function actionOnCloseModalSignUP(){
    btnCloseModalSignUp?.addEventListener("click",(e)=>{
        openModalLoginSingUP();
    });
}

export function loadAllModalSignUPFeatures(){
    actionOnCloseModalSignUP();
}