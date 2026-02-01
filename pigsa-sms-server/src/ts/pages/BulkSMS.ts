import { SmsSender } from "capacitor-sms-sender";
import { ActionsOnFormSendBulkSMS } from "../components/bulkSMS/formSendBulkSMS";
import { ACPanel } from "./cpanel/ACPanel";
import { bulkSMS as template } from "./templates/bulkSMS";
import { Capacitor } from "@capacitor/core";
import swal from "sweetalert";
import { TLoaderInContainer, loaderInContainer } from "../utils/functions/loaderInContainer";
import { createPendingSMSSendRequest, detectExistSMSToSend, sendSMSAlouUnitelTmais } from "../utils/functions/SendSMS";

export class BulkSMS extends ACPanel{
    static readonly PAGE_TITLE = "PIGSA Server - Enviar SMS em massa";

    public static instance:BulkSMS;
    private actionsOnFormSendSMS = ActionsOnFormSendBulkSMS;

    private innerLoaderPage?:TLoaderInContainer;

    constructor(appDiv:HTMLDivElement){
        super(appDiv,template,BulkSMS.PAGE_TITLE);

        //this.addEvents(this.signupWithGoogle);

        BulkSMS.instance = this;

    }

    public override render(): void {
        super.render();

        this.innerLoaderPage = loaderInContainer("#bulkSMS .loader");

        this.actionsOnFormSendSMS = ActionsOnFormSendBulkSMS.setRootElement(this.appDiv);

        this.actionsOnFormSendSMS.addAndRemoveNumberActions();

        this.actionsOnFormSendSMS.onSubmitForm(this.submitFormSendBulkSMS.bind(this));

    }

    private submitFormSendBulkSMS(formData:FormData,formElement:HTMLFormElement){

        swal({
            title: "Enviar SMS",
            text: "Tens a certeza de que pretendes enviar SMS aos números indicados?",
            buttons: ["Cancelar", "Enviar"]
        })
        .then(async(willDelete) => {
            if (willDelete) {
                this.innerLoaderPage?.show();

                let phoneNumberArr = ((formData.get("phone") as unknown) as string).split(";");
                let sms = (formData.get("sms")as unknown) as string;

                for (const phoneNumber of phoneNumberArr) {
                    let segundoNumero = phoneNumber[1];
                    let operadora = +segundoNumero>=5?"alou":"unitel T+";

                    console.log(Capacitor.getPlatform(),phoneNumber,segundoNumero,operadora,sms);

                    // createPendingSMSSendRequest(
                    //     phoneNumber,
                    //     sms,
                    //     operadora,
                    //     "Bulk SMS",
                    //     undefined,
                    //     undefined
                    // );
                    // this.innerLoaderPage?.hide();

                    if(["android","ios"].includes(Capacitor.getPlatform())){


                        sendSMSAlouUnitelTmais(phoneNumber,sms,operadora,0,"Bulk SMS");

                        // if(resp.status=="SENT"||resp.status=="DELIVERED"){
                        //     swal(
                        //         "Enviado",
                        //         "SMS enviado com sucesso ao numero: "+resp.phoneNumber+" operadora: "+resp.operadora,"success"
                        //     );
                        //     formElement.reset();
                        // }else{
                        //     swal(
                        //         "Erro de envio",
                        //         "SMS não enviado ao numero: "+resp.phoneNumber+" operadora: "+resp.operadora,
                        //         "error"
                        //     );
                        // }
                        this.innerLoaderPage?.hide();

                    }else{
                        createPendingSMSSendRequest(
                            phoneNumber,
                            sms,
                            operadora,
                            "Bulk SMS",
                            undefined,
                            undefined
                        );
                        this.innerLoaderPage?.hide();
                    }
                }
            }
        });

        // httpRequest<IClaimsCreated>("/claims/csugdr/update","POST",true,formData,formElement)
        // .then(dataResp=>{
        //     swal("Feito",dataResp.message,"success");

        //     ActionsOnFormCreateDR.resetForm();

        //     this.innerLoaderPage?.hide();
        //     this.resetContainerOffLine();

        //     if(!this.niaUsed){
        //         this.optionsOndrContainer?.classList.add("d-none");
        //         this.containerFormCreateDr?.classList.add("d-none");
        //         this.containerFormSubmitFile?.classList.add("d-none");
        //         this.optionsOndrContainer?.querySelector(".card-update-declaration")?.classList.add("active");
        //     }else{
        //         this.innerLoaderPage?.show();
        //         csuDrDBSyncReadAll().then(items=>{
        //             let arrayToSync = items.filter(el=>(el.NIA.trim()!=niaCreated));

        //             items.forEach(async(item)=>{
        //                 await csuDrDBSyncRemove(item.id)
        //             });

        //             console.log("arrayToSync",arrayToSync)

        //             //clearCSU_DR_Offline_Data_sync();

        //             arrayToSync.forEach(async(item)=>{
        //                 await csuDrDBSyncCreate(item)
        //             });

        //             this.notifyQtdDataToSync();

        //             this.innerLoaderPage?.hide();
        //         });
        //         //this.checkNIAIsAlreadyRegistered(this.niaUsed);
        //         this.optionsOndrContainer?.classList.add("d-none");
        //         this.containerFormCreateDr?.classList.add("d-none");
        //         this.containerFormSubmitFile?.classList.add("d-none");
        //     }
            
        // })
        // .catch(err=>{
        //     console.error(err);
        //     this.innerLoaderPage?.hide();
        // });
    }
}