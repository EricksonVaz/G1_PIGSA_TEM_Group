import { closeModal, showModal } from "./modalCtrl";

let modalNameRef = "modal-login-signup"


let allElementWithModalRef = document.querySelectorAll<HTMLElement>(`[data-modal="${modalNameRef}"]`);
let modalLoginSignup = document.querySelector(".modal-login-signup") as HTMLDivElement;
let containerOptionsLogin = modalLoginSignup.querySelector(".container-options-login") as HTMLDivElement;
let formContainer = modalLoginSignup.querySelector(".form-container") as HTMLDivElement;

let formLoginEmail = formContainer.querySelector(".form-login-email") as HTMLFormElement;
let formLoginPhone = formContainer.querySelector(".form-login-phone") as HTMLFormElement;
let formLoginRecovery = formContainer.querySelector(".form-login-recovery") as HTMLFormElement;
let formOTPLogin = formContainer.querySelector(".form-otp-login") as HTMLFormElement;

let linkOpenFormRecovryEmail = formContainer.querySelector(".recovery-email") as HTMLElement;
let linkRegisterEmail = formContainer.querySelector(".register-email") as HTMLElement;

let linkResendSMSOTP = formOTPLogin.querySelector(".not-recive-sms") as HTMLElement;

let btnLoginFacebook = modalLoginSignup.querySelector(".facebook") as HTMLButtonElement;
let btnLoginGoogle = modalLoginSignup.querySelector(".google") as HTMLButtonElement;

function actionsToOpenModalRef(){
    allElementWithModalRef?.forEach(elRefModal=>{
        elRefModal.addEventListener("click",()=>{
            openModalLoginSingUP();
        });
    });
}

export function openModalLoginSingUP(){
    let modalRef = showModal(modalNameRef);

    formContainer?.querySelectorAll("form").forEach(form=>{
        form.reset();

        form.classList.add("d-none");
    });

    containerOptionsLogin?.querySelectorAll(".btn").forEach(btn=>{
        btn.classList.remove("active");
    });

    formContainer?.querySelector(`[data-login-form="email"]`)?.classList.remove("d-none");
    containerOptionsLogin?.querySelector(`[data-login-tab="email"]`)?.classList.add("active");

}

function onActionTabLogin(){
    containerOptionsLogin?.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        let tabId = "";

        if(elementClicked?.classList.contains("option")){
             if(elementClicked?.classList.contains("btn")){
                tabId = (elementClicked.dataset?.loginTab??"").trim();

                if(!elementClicked?.classList.contains("active")){
                    tabId = (elementClicked.dataset?.loginTab??"").trim();
                }

             }else{
                let parentElement = elementClicked.closest("btn") as HTMLElement;

                if(!parentElement.classList.contains("active")){
                    tabId = (parentElement.dataset?.loginTab??"").trim();
                    elementClicked = parentElement;
                }
             }
        }

        if(tabId){
            containerOptionsLogin.querySelector(".active")?.classList.remove("active");
            elementClicked.classList.add("active");

            formContainer.querySelectorAll("form").forEach(form=>form.classList.add("d-none"));

            formContainer.querySelector(`[data-login-form="${tabId}"]`)?.classList.remove("d-none");
        }
    })
}

function showFormInContainer(tabId:string){
    containerOptionsLogin?.querySelector(".active")?.classList.remove("active");

    formContainer?.querySelectorAll("form").forEach(form=>form.classList.add("d-none"));

    formContainer?.querySelector(`[data-login-form="${tabId}"]`)?.classList.remove("d-none");
}

function actionOpenRecoveryEmailForm(){
    linkOpenFormRecovryEmail?.addEventListener("click",(e)=>{

        showFormInContainer("recovery");
    });
}

function actionOpenModalCreateAccount(){
    linkRegisterEmail?.addEventListener("click", (e)=>{
        closeModal();

        showModal("modal-signup");
    });
}

function onFormLoginEmailSubmited(){
    formLoginEmail?.addEventListener("submit",(e)=>{
        e.preventDefault();

        swal("Login With Email & Password");
    });
}

function onFormRecoveryEmailSubmited(){
    formLoginRecovery?.addEventListener("submit",(e)=>{
        e.preventDefault();

        swal("Form Recuperar Password Submited");
    });
}

function onFormLoginPhoneSubmited(){
    formLoginPhone?.addEventListener("submit",(e)=>{
        e.preventDefault();

        showFormInContainer("otp");
        
    });
}

function onFormOTPSubmited(){
    formOTPLogin?.addEventListener("submit",(e)=>{
        e.preventDefault();

        swal("Form Submite OTP Codi Okay")
        
    });
}

function onBtnLoginSocialMediaClicked(){
    btnLoginFacebook?.addEventListener("click",(e)=>{
        swal("Login Facebook");
    });

    btnLoginGoogle?.addEventListener("click",(e)=>{
        swal("Login Google");
    });
}

function onLinkResendSMSOTP(){
    linkResendSMSOTP?.addEventListener("click",(e)=>{
        swal("Reenviar SMS com OTP Novamente")
    });
}


export function loadAllModalLoginSignupFeatures(){
    actionsToOpenModalRef();
    onActionTabLogin();
    actionOpenRecoveryEmailForm();

    onFormLoginEmailSubmited();
    onFormRecoveryEmailSubmited();
    onFormLoginPhoneSubmited();
    onFormOTPSubmited();

    onBtnLoginSocialMediaClicked();
    onLinkResendSMSOTP();

    actionOpenModalCreateAccount();
}