import { Capacitor } from "@capacitor/core";
import { ActionsOnFormSendSMS } from "../components/sendSMS/formSendSMS";
import { TLoaderInContainer, loaderInContainer } from "../utils/functions/loaderInContainer";
import { ACPanel } from "./cpanel/ACPanel";
import { sendSMS as template } from "./templates/sendSMS";
import swal from "sweetalert";
import { createPendingSMSSendRequest, sendSMSAlouUnitelTmais } from "../utils/functions/SendSMS";
import { getDatabase} from "firebase/database";
import { appFirebase } from "../utils/functions/FirebaseConect";

const db = getDatabase(appFirebase);

export class SendSMS extends ACPanel{
    static readonly PAGE_TITLE = "PIGSA Server - Enviar SMS";

    public static instance:SendSMS;
    private actionsOnFormSendSMS = ActionsOnFormSendSMS;

    private innerLoaderPage?:TLoaderInContainer;

    constructor(appDiv:HTMLDivElement){
        super(appDiv,template,SendSMS.PAGE_TITLE);

        //this.addEvents(this.signupWithGoogle);

        SendSMS.instance = this;

    }

    public override render(): void {
        super.render();

        this.innerLoaderPage = loaderInContainer("#sendSMS .loader");

        this.actionsOnFormSendSMS = ActionsOnFormSendSMS.setRootElement(this.appDiv);

        this.actionsOnFormSendSMS.onSubmitForm(this.submitFormSendSMS.bind(this));

    }

    private submitFormSendSMS(formData:FormData,formElement:HTMLFormElement){

        swal({
            title: "Enviar SMS",
            text: "Tens a certeza de que pretendes enviar um SMS ao número indicado?",
            buttons: ["Cancelar", "Enviar"]
        })
        .then(async(willDelete) => {
            if (willDelete) {
                this.innerLoaderPage?.show();

                let phoneNumber = (formData.get("phone") as unknown) as string;
                let sms = (formData.get("sms")as unknown) as string;

                let segundoNumero = phoneNumber[1];
                let operadora = +segundoNumero>=5?"alou":"unitel T+";

                console.log(Capacitor.getPlatform(),phoneNumber,segundoNumero,operadora,sms);

                // createPendingSMSSendRequest(
                //     phoneNumber,
                //     sms,
                //     operadora,
                //     "Send SMS",
                //     ()=>{
                //         swal(
                //             "Enviado",
                //             "SMS enviado com sucesso ao numero: "+phoneNumber+" operadora: "+operadora,"success"
                //         );
                //         formElement.reset();
                //         this.innerLoaderPage?.hide();
                //     },
                //     ()=>{
                //         swal(
                //             "Erro de envio",
                //             "SMS não enviado ao numero: "+phoneNumber+" operadora: "+operadora,
                //             "error"
                //         );
                //         this.innerLoaderPage?.hide();
                //     }
                // );

                if(["android","ios"].includes(Capacitor.getPlatform())){


                    let resp = await sendSMSAlouUnitelTmais(phoneNumber,sms,operadora,0,"Send SMS");

                    if(resp.status=="SENT"||resp.status=="DELIVERED"){
                        swal(
                            "Enviado",
                            "SMS enviado com sucesso ao numero: "+resp.phoneNumber+" operadora: "+resp.operadora,"success"
                        );
                        formElement.reset();
                    }else{
                        swal(
                            "Erro de envio",
                            "SMS não enviado ao numero: "+resp.phoneNumber+" operadora: "+resp.operadora,
                            "error"
                        );
                    }
                    this.innerLoaderPage?.hide();

                }else{
                    createPendingSMSSendRequest(
                        phoneNumber,
                        sms,
                        operadora,
                        "Send SMS",
                        ()=>{
                            swal(
                                "Enviado",
                                "SMS enviado com sucesso ao numero: "+phoneNumber+" operadora: "+operadora,"success"
                            );
                            this.innerLoaderPage?.hide();
                        },
                        ()=>{
                            swal(
                                "Erro de envio",
                                "SMS não enviado ao numero: "+phoneNumber+" operadora: "+operadora,
                                "error"
                            );
                            this.innerLoaderPage?.hide();
                        }
                    );
                }
            }
        });
    }
}