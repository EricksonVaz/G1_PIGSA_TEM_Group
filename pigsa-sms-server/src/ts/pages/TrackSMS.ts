import { Capacitor } from "@capacitor/core";
import { ACPanel } from "./cpanel/ACPanel";
import { trackSMS as template } from "./templates/trackSMS";
import { SmsSender } from "capacitor-sms-sender";
import { detectExistSMSToSend, smsServerPrefix } from "../utils/functions/SendSMS";
import { getDatabase, onValue, push, ref, update } from "firebase/database";
import { appFirebase } from "../utils/functions/FirebaseConect";
import { itemTrack } from "../components/trackSMS/itemTrack";


const db = getDatabase(appFirebase);

export class TrackSMS extends ACPanel{
    static readonly PAGE_TITLE = "PIGSA Server - Enviar SMS em massa";

    public static instance:TrackSMS;

    private containerDetails?:HTMLDivElement;
    private queueContainer?:HTMLDivElement;
    private historyContainer?:HTMLDivElement;

    constructor(appDiv:HTMLDivElement){
        super(appDiv,template,TrackSMS.PAGE_TITLE);

        //this.addEvents(this.signupWithGoogle);

        TrackSMS.instance = this;

    }

    public override render(): void {
        super.render();

        this.containerDetails = this.appDiv.querySelector(".container-details") as HTMLDivElement;

        if(this.containerDetails){
            this.queueContainer = this.containerDetails.querySelector(".queue-container.queue .list-container") as HTMLDivElement;
            this.historyContainer = this.containerDetails.querySelector(".queue-container.historico .list-container") as HTMLDivElement;
        }

        this.loadExecutionAndHistory();

    }


    private loadExecutionAndHistory(){
        const starCountRef = ref(db, `SMSToSend-${smsServerPrefix()}/`);
        onValue(starCountRef, (snapshot) => {
            let allValues = snapshot.val();

            let arrObj = Object.entries(allValues);

            let objArrComplet =  arrObj.map(objFire=>{
                let [key,obj] = objFire;
                return {
                    key,
                    ...(obj as any)
                }
            }).sort((a, b) => {
                const dateA = new Date(a.dateTime.split(' ')[0].split('/').reverse().join('-') + 'T' + a.dateTime.split(' ')[1]);
                const dateB = new Date(b.dateTime.split(' ')[0].split('/').reverse().join('-') + 'T' + b.dateTime.split(' ')[1]);
                //@ts-expect-error
                return dateB - dateA;
            });

            console.log(objArrComplet)


            let historyObjArr = objArrComplet.filter(el=>{
                if(["SENT","ERROR"].includes(el.status)) return el;
            })
            .map(obj=>{
                const {origin,dateTime,phoneNumber,sms,status} = obj;

                return itemTrack(origin,phoneNumber,dateTime,sms,status);
            });
            let executionObjArr = objArrComplet.filter(el=>{
                if(!(["SENT","ERROR"].includes(el.status))) return el;
            }).map(obj=>{
                const {origin,dateTime,phoneNumber,sms,status} = obj;

                return itemTrack(origin,phoneNumber,dateTime,sms,status);
            });

            if(executionObjArr.length){
                if(this.queueContainer)this.queueContainer.innerHTML = executionObjArr.join("");
            }else{
                if(this.queueContainer)this.queueContainer.innerHTML = "<h2>Sem SMS na fila de execução</h2>";
            }

            if(historyObjArr.length){
                if(this.historyContainer)this.historyContainer.innerHTML = historyObjArr.join("");
            }else{
                if(this.historyContainer)this.historyContainer.innerHTML = "<h2>Sem históricos de SMS enviados</h2>";
            }
        });
    }
}