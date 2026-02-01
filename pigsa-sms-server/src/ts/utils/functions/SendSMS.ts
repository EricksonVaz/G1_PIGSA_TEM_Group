import { SmsSender } from "capacitor-sms-sender";
import { getDatabase, onValue, push, ref, update } from "firebase/database";
import { appFirebase } from "./FirebaseConect";
import { formatDateAndTime } from "./dateValidation";


const db = getDatabase(appFirebase);

interface ISendSMSResponse {
    phoneNumber:string,
    sms:string,
    operadora:string,
    attemp:number,
    status:string
}

export function smsServerPrefix(){
    return (process.env.NODE_ENV=="development"?"dev":"prod");
}

export function sendSMS(
    phoneNumber:string,
    sms:string,
    operadora:string,
    attemp:number = 0,
){
    return new Promise<ISendSMSResponse>((resolve,reject)=>{
        attemp++
        let opts = {
            id: 1,
            sim: 1,
            phone: `${phoneNumber}`,
            text: sms
        }

        if(operadora=="unitel T+"){
            opts.sim = 2;
        }
        //9784112
        SmsSender.send(opts)
        .then(res => {
            console.log("SmsSender",res)
        });
        SmsSender.addListener('smsSenderStatusUpdated', res => {
            let {status} = res;

            if(status=="SENT" || status=="DELIVERED"){
                resolve({phoneNumber,sms,operadora,attemp,status});
            }else{
                reject({phoneNumber,sms,operadora,attemp,status});
            }
            console.log('smsSenderStatusUpdated',res);
        });
    });
}

export async function sendSMSAlouUnitelTmais(
    phoneNumber:string,
    sms:string,
    operadora:string,
    attemp:number,
    origin:string
){
    let keyToUpdate:string|null = null;
    if(origin=="Bulk SMS" || origin =="Send SMS"){
        let val = await push(ref(db, `SMSToSend-${smsServerPrefix()}/`), {
            phoneNumber,
            sms,
            operadora,
            origin,
            dateTime:formatDateAndTime(),
            status:'PROCESSING'
        });

        keyToUpdate = val.key;
    }
    try {
        let respSMSSendObj = await sendSMS(phoneNumber,sms,operadora,attemp);
        if((origin=="Bulk SMS" || origin =="Send SMS")&&keyToUpdate){
            const updates:{[key:string]:Object} = {};

            updates[`/SMSToSend-${smsServerPrefix()}/` + keyToUpdate] = {
                phoneNumber,
                sms,
                operadora,
                origin,
                dateTime:formatDateAndTime(),
                status:'SENT'
            };
            update(ref(db), updates);
            let arrKeyInProccessInServer = JSON.parse(localStorage.getItem("smsInProcessInServer") ?? "[]") as string[];
            arrKeyInProccessInServer = arrKeyInProccessInServer.filter(key=>key!=keyToUpdate);
            localStorage.setItem("smsInProcessInServer",JSON.stringify(arrKeyInProccessInServer));
        }
        console.log("SMS Enviado",respSMSSendObj);
        return respSMSSendObj;
    } catch (error) {
        let errorOBJ = error as ISendSMSResponse;

        console.log("erro ao tentar enviar SMS",errorOBJ);

        if((origin=="Bulk SMS" || origin =="Send SMS")&&keyToUpdate){
            const updates:{[key:string]:Object} = {};

            updates[`/SMSToSend-${smsServerPrefix()}/` + keyToUpdate] = {
                phoneNumber,
                sms,
                operadora,
                origin,
                dateTime:formatDateAndTime(),
                status:'ERROR'
            };
            update(ref(db), updates);
        }

        if(errorOBJ.attemp<2){
            let otherOperadora = (errorOBJ.operadora=="alou"?"unitel T+":"alou");
            let respObj = (await sendSMSAlouUnitelTmais(phoneNumber,sms,otherOperadora,attemp,origin)) as ISendSMSResponse

            if(typeof respObj!="undefined")return respObj;
            else return errorOBJ;
            //return respObj;
        }else{
            return errorOBJ;
        }
    }
}

export async function sendSMSAlouUnitelTmaisFireBase(
    phoneNumber:string,
    sms:string,
    operadora:string,
    attemp:number,
    origin:string,
    keyToUpdate:string
){

    const updates:{[key:string]:Object} = {};

    try {
        let respSMSSendObj = await sendSMS(phoneNumber,sms,operadora,attemp);
        console.log("SMS Enviado",respSMSSendObj);

        updates[`/SMSToSend-${smsServerPrefix()}/` + keyToUpdate] = {
            phoneNumber,
            sms,
            operadora,
            origin,
            dateTime:formatDateAndTime(),
            status:'SENT'
        };
        update(ref(db), updates);

        let arrKeyInProccessInServer = JSON.parse(localStorage.getItem("smsInProcessInServer") ?? "[]") as string[];
        arrKeyInProccessInServer = arrKeyInProccessInServer.filter(key=>key!=keyToUpdate);
        localStorage.setItem("smsInProcessInServer",JSON.stringify(arrKeyInProccessInServer));

        return respSMSSendObj;
    } catch (error) {
        let errorOBJ = error as ISendSMSResponse;

        console.log("erro ao tentar enviar SMS",errorOBJ);

        if(errorOBJ.attemp<2){
            let otherOperadora = (errorOBJ.operadora=="alou"?"unitel T+":"alou");
            let respObj = (await sendSMSAlouUnitelTmais(phoneNumber,sms,otherOperadora,attemp,origin)) as ISendSMSResponse

            updates[`/SMSToSend-${smsServerPrefix()}/` + keyToUpdate] = {
                phoneNumber,
                sms,
                operadora,
                origin,
                dateTime:formatDateAndTime(),
                status:'SENT'
            };
            update(ref(db), updates);

            let arrKeyInProccessInServer = JSON.parse(localStorage.getItem("smsInProcessInServer") ?? "[]") as string[];
            arrKeyInProccessInServer = arrKeyInProccessInServer.filter(key=>key!=keyToUpdate);
            localStorage.setItem("smsInProcessInServer",JSON.stringify(arrKeyInProccessInServer));

            if(typeof respObj!="undefined")return respObj;
            else return errorOBJ;
            //return respObj;
        }else{
            updates[`/SMSToSend-${smsServerPrefix()}/` + keyToUpdate] = {
                phoneNumber,
                sms,
                operadora,
                origin,
                dateTime:formatDateAndTime(),
                status:'ERROR'
            };
            update(ref(db), updates);
            return errorOBJ;
        }
    }
}

export function detectExistSMSToSend(){
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
        })

        let arrKeyInProccessInServer = JSON.parse(localStorage.getItem("smsInProcessInServer") ?? "[]");

        //let newKeysArrNotSendAgain = objArrComplet.map(el=>el.key);

        //arrKeyInProccessInServer = [...arrKeyInProccessInServer,...newKeysArrNotSendAgain];


        objArrComplet = objArrComplet.filter(el=>el.status=="PENDING");

        for (const objSMS of objArrComplet) {
            let {phoneNumber,sms,operadora,key,origin} = objSMS;

            if(!(arrKeyInProccessInServer.includes(key))){
                arrKeyInProccessInServer.push(key);

                localStorage.setItem("smsInProcessInServer",JSON.stringify(arrKeyInProccessInServer));

                const updates:{[key:string]:Object} = {};
                    updates[`/SMSToSend-${smsServerPrefix()}/` + key] = {
                    phoneNumber,
                    sms,
                    operadora,
                    origin,
                    dateTime:formatDateAndTime(),
                    status:'PROCESSING'
                };
                update(ref(db), updates);

                sendSMSAlouUnitelTmaisFireBase(phoneNumber,sms,operadora,0,origin,key);

            }
        }
    });
}

export function createPendingSMSSendRequest(
    phoneNumber:string,
    sms:string,
    operadora:string,
    origin:string,
    successCB:Function|undefined,
    errorCB:Function|undefined
){
    push(ref(db, `SMSToSend-${smsServerPrefix()}/`), {
        phoneNumber,
        sms,
        operadora,
        origin,
        dateTime:formatDateAndTime(),
        status:'PENDING'
    }).then((val)=>{
        console.log(val.key)
        const starCountRef = ref(db, `SMSToSend-${smsServerPrefix()}/` + val.key);
        onValue(starCountRef, (snapshot) => {
            const {phoneNumber,sms,operadora,status,origin,dateTime} = snapshot.val();
            if(status=="SENT" || status=="DELIVERED"){
                if(successCB)successCB();
            }else if(status=="ERROR"){
                if(errorCB)errorCB();
            }
        });
    });
}