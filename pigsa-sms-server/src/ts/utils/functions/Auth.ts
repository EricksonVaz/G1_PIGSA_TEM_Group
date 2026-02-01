import { hideBackdrop } from "../../components/backdrop";
import { Router } from "../Router";
import jwt_decode from "jwt-decode";
import { IHttpRequestResponse } from "../interfaces/IHttpRequestResponse";

interface IJWTHeader{
    alg:string,
    site:string,
    type:string
}
type dataJWT = {
    id:string,
    name:string,
    access:string,
    level?:number,
    concelho:string
};
interface IJWTBody{
    data:dataJWT,
    exp:number,
    iat:number
}

export function login(jwtToken:string){
    localStorage.setItem("jwt-sms-server",jwtToken);

    let {jwtBody} = jwtDecoded();
    setUserNameInLabel(jwtBody!.data.access);
    if([1,2].includes(jwtBody?.data?.level??0)){
        Router.navigateTo("/sms-server/send");
    }else{
        Router.navigateTo("/sms-server/not-found");
    }
    
    
}

export function logout(){
    if(window.navigator.onLine){
        let {jwtBody} = jwtDecoded();
        localStorage.removeItem("jwt-sms-server");

        hideBackdrop();

        // if(jwtBody?.data.typeLogin=="organization"){
        //     Router.navigateTo("/organization-login");
        //     return;
        // }

        Router.navigateTo("/sms-server/login");
    }
}

export function manageProctedFeatures(){
    let {jwtBody} = jwtDecoded();
    let level = jwtBody?.data.level ?? 0;
    let idUserLogged = jwtBody?.data.id ?? "";
    let access = jwtBody?.data.access ?? ""; //tecnico.csu
    if(level!=0){
        let elementsToControl = document.querySelectorAll<HTMLElement>("[data-can]");

        elementsToControl.forEach(element=>{
            let canArr:any[] = [] 
            try{
                canArr = JSON.parse(element.dataset.can ?? "[]");

                if(typeof canArr != "object" && !Array.isArray(canArr)) canArr = [];
            }catch(err){
            }

            if(!canArr.includes(level)) element.remove();
        });
    }

    if(!idUserLogged.includes("cs_"))document.querySelector(".manage-my-account-link")?.remove();

    if(idUserLogged.includes("cs_") || access.includes("tecnico.csu")){
        document.querySelector(".menu-dr")?.remove();
    }
}

export function jwtDecoded(){
    let jwtToken = localStorage.getItem("jwt-sms-server") ?? "";
    let jwtBody:IJWTBody|undefined = undefined;
    let jwtHeader:IJWTHeader|undefined = undefined;
    try {
        jwtBody= jwt_decode(jwtToken);
        jwtHeader = jwt_decode(jwtToken,{header:true});
    } catch (error) {
    }finally{
        return {jwtHeader,jwtBody}
    }
}

export function jwtDelete(){
    localStorage.removeItem("jwt-sms-server");
}

export function jwtRefresh(jwt:string){
    localStorage.setItem("jwt-sms-server",jwt);

    updateUserNameLabel();
}

export function updateUserNameLabel(){
    let {jwtBody} = jwtDecoded();

    setUserNameInLabel(jwtBody?.data.access??"Test");
}

function setUserNameInLabel(firstname:string){
    let userNameEl = document.querySelector(".label-user");

    if(userNameEl)userNameEl.innerHTML = firstname;
}

export function manageAccessProctedFeatures<T>(dataResp:IHttpRequestResponse<T>){
    let elementsToControl = document.querySelectorAll<HTMLElement>("[data-access-can]");

    console.log("elementsToControl",elementsToControl,dataResp.accessLevel);

    elementsToControl.forEach(element=>{
        let canArr:any[] = [] 
        try{
            canArr = JSON.parse(element.dataset.accessCan ?? "[]");

            if(typeof canArr != "object" && !Array.isArray(canArr)) canArr = [];
        }catch(err){
        }

        element.classList.add("d-none");

        console.log("canArr",canArr);

        if(canArr.includes(dataResp.accessLevel)) element.classList.remove("d-none");
    });
}