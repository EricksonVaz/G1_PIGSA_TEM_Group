import swal from "sweetalert";
import { addEventHolderToggler, btnHolderToggler } from "../../components/btn-holder-toggler";
import { onNavigationPageItem, paginationItem as paginationItemComponent } from "../../components/pagination-item";
import { jwtDecoded, logout, updateUserNameLabel } from "../../utils/functions/Auth";
import { badRequestHandle, httpRequest } from "../../utils/functions/HttpRequest";
import { TLoaderInContainer, loaderInContainer } from "../../utils/functions/loaderInContainer";
import { hideModals, showModal } from "../../utils/functions/modals-ctrl";
import { APage } from "../APage";
import { CPanel } from "../CPanel";
import { ActionsModalUpdatePassword, modalUpdatePassword } from "../../components/modals/modal-update-password";
import { autoLogoutIn } from "../../utils/functions/AutoLogout";
import { SmsSender } from "capacitor-sms-sender";
import { detectExistSMSToSend } from "../../utils/functions/SendSMS";
import { Capacitor } from "@capacitor/core";

interface IUserInfoCard {
    idUser:string,
    firstnameUser:string,
    lastnameUser:string,
    levelUser:string
}

export class ACPanel extends APage{

    private actionsModalUpdatePassword = ActionsModalUpdatePassword;

    public static instance:ACPanel;
    protected static alreadyRendered = false;

    constructor(protected appDiv:HTMLDivElement,template:string,title:string){
        super(appDiv,template,title);

        this.addEvents(this.logout.bind(this));
        this.addEvents(this.openModalUpdateMyPassword.bind(this));
        this.addEvents(this.onResetForms.bind(this));
        this.addEvents(this.closeModalsOpem);

        ACPanel.instance = this;


        //let idSec = +(localStorage.getItem("pastTime") ?? 0);

        //localStorage.setItem("pastTime","0");
    }

    public override render(): void {
        super.render();

        this.appDiv.insertAdjacentHTML("beforeend",modalUpdatePassword);

        if(!ACPanel.alreadyRendered){
            this.loadCBEvents();
            if(["android","ios"].includes(Capacitor.getPlatform())){
                SmsSender.requestPermissions().then(res=>console.log(res));

                detectExistSMSToSend();
            }
        }

        ACPanel.alreadyRendered = true;

        updateUserNameLabel();

        this.fillDropdownLevel();
        this.showResponsiveMenuActive();

        this.actionsModalUpdatePassword = ActionsModalUpdatePassword.setRootElement(this.appDiv);

        this.actionsModalUpdatePassword.addEventSubmitForm((formData:FormData,loader?:TLoaderInContainer,formElement?:HTMLFormElement)=>{
            if(loader && formElement)this.onSubmitFormUpdatePassword(formData,loader,formElement);
        });

        //autoLogoutIn(600)//10 minutes

    }

    protected logout(elementClicked:HTMLElement){
        if(elementClicked.classList.contains("logout")){
            swal({
                title: "Terminar Secção",
                text: "Tens a certeza de que pretendes terminar a secção",
                icon: "warning",
                buttons: ["Cancelar", "Terminar"],
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                   logout();
                }
            });
            
        }
    }

    private showResponsiveMenuActive(){
        this.appDiv.querySelectorAll(".nav-icon-bar").forEach(iconNav=>{
            iconNav.addEventListener("click",()=>{
                this.appDiv.querySelector(".navigation")?.classList.toggle("active");
            })
        });
    }

    protected fillDropdownLevel(){
        let listSelectWithLevelDropdown = this.appDiv.querySelectorAll<HTMLSelectElement>(`select.select-level`);
        listSelectWithLevelDropdown.forEach(select=>{
            //select.innerHTML = optionsLevelDropdown();
        });
    }

    private openModalUpdateMyPassword(elementClicked:HTMLElement){
        if(elementClicked.classList.contains("manage-my-account-link")){
            showModal("update-pass");
            //let modalElement = this.appDiv.querySelector("#modal-manage-my-account");
            // let  modalBody = modalElement?.querySelector(".modal-body") as HTMLDivElement;

            // this.showTabInModal(modalBody,"my-info");
            // UpdateMyInfoForm.fillDataInForm(this.appDiv);
            //this.listAllUsers();
        }
    }


    public showTabInModal(
        modalBody:HTMLElement|null|undefined,
        tabToShow:string|undefined
    ){
        modalBody?.querySelector(".btn-tab-modal.active")?.classList.remove("active");

        modalBody?.querySelectorAll("[data-tab-id]").forEach(container=>{
            let tabId = (container as HTMLDivElement).dataset.tabId;

            container.classList.add("d-none");

            if(tabId==tabToShow) container.classList.remove("d-none");
            
        });

        modalBody?.querySelector(`[data-tab="${tabToShow}"]`)?.classList.add("active");
    }

    public onResetForms(elementClicked:HTMLElement){
        if(elementClicked.classList.contains("btn-cancel-task")){
            let modalBody = elementClicked.closest(".modal-body") as HTMLDivElement;
            if(elementClicked.hasAttribute("data-go-backtab")){
                let tabGoBack = elementClicked.dataset.goBacktab;
                this.showTabInModal(modalBody,tabGoBack);
            }else{
                let btnShowUsersList = modalBody?.querySelector(`.tab-default`) as HTMLButtonElement;

                btnShowUsersList?.click();
            }
        }
    }

    private onSubmitFormUpdatePassword(formData:FormData,loader:TLoaderInContainer,formElement:HTMLFormElement){
        swal({
            title: "Alterar Password",
            text: "Tens a certeza de que pretendes alterar o password",
            icon: "warning",
            buttons: ["Cancelar", "Alterar"],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                httpRequest("/claims/me/change-password","PUT",true,formData,formElement)
                .then(dataResp=>{
                    swal("Feito",`Password alterado com sucesso`,"success");

                    formElement?.reset();
                    loader?.hide();
                })
                .catch(err=>{
                    console.error(err);
                    // if(typeof err =="object" && ("errorFeedback" in err)){
                    //     let dataRespError = err as IHttpRequestResponse<any>;

                    //     let errorFeedback = dataRespError.errorFeedback;

                    //     if(errorFeedback){
                    //         let arrInputsName = errorFeedback.map(err=>err.formControll);

                    //         badRequestHandle(dataRespError,formElement);
                    //         ActionsOnFormNewClaims.showStepOnErrorDetected(arrInputsName);
                    //     }
                    // }
                    loader?.hide();
                });
            }else{
                loader?.hide();
            }
        });
    }
}