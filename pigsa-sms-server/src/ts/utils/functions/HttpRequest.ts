import swal from "sweetalert";
import { IHttpRequestResponse } from "../interfaces/IHttpRequestResponse";
import { logout } from "./Auth";
import { ActionsFilterRegionContainer } from "../../components/cpanel/filterRegionContainer";

export type formErrorSpreadObj = {[key:string]:string};

export let httpRequestcontroller:AbortController;

export let endPointPrefix = (function(){
    //return "https://mynodejs.host";

    console.log(process.env.NODE_ENV)

    if(process.env.NODE_ENV=="development"){
        return "http://10.228.125.220:3000";
    }else{
        return "https://mynodejs.host";
    }
    // if(["localhost","127.0.0.1"].includes(window.location.hostname)){
    //     return "http://localhost:3000";
    // }else if(["192.168.1.248"].includes(window.location.hostname)){
    //      return "http://192.168.1.248:3000";
    // }else{
    //     return "https://mynodejs.host";
    // }
})();

export function httpRequest<T>(
    endpoint:string,
    method:string="GET",
    isAuth:boolean=false,
    formData:FormData|string|undefined=undefined,
    htmlElement:HTMLElement|undefined=undefined
):Promise<IHttpRequestResponse<T>>{

    let fetchCB:Promise<Response>;
    httpRequestcontroller = new AbortController();
    const signal = httpRequestcontroller?.signal

    if( ["DELETE","GET"].includes(method.toUpperCase())){
        formData = undefined;
    }
    
    if(isAuth){
        let jwtToken = localStorage.getItem("jwt-sms-server");

        if(typeof formData!=="undefined"){
            if(typeof formData == "string"){
                fetchCB = fetch(endPointPrefix+endpoint,{
                    method,
                    headers:{
                        "Authorization":`Bearer ${jwtToken}`,
                        "FilterRegion":(ActionsFilterRegionContainer?.currentConcelhoFilter??""),
                        "Content-Type":"application/json; charset=utf-8"
                    },
                    body:formData,
                    signal
                });
            }else{
                fetchCB = fetch(endPointPrefix+endpoint,{
                    method,
                    headers:{
                        "Authorization":`Bearer ${jwtToken}`,
                        "FilterRegion":(ActionsFilterRegionContainer?.currentConcelhoFilter??""),
                    },
                    body:formData,
                    signal
                });
            }

        }else{
            fetchCB = fetch(endPointPrefix+endpoint,{
                method,
                headers:{
                    "Authorization":`Bearer ${jwtToken}`,
                    "FilterRegion":(ActionsFilterRegionContainer?.currentConcelhoFilter??""),
                },
                signal
            });
        }
    }else{
        if(typeof formData!=="undefined"){
            if(typeof formData == "string"){
                fetchCB = fetch(endPointPrefix+endpoint,{
                    method,
                    headers:{
                        "Content-Type":"application/json; charset=utf-8"
                    },
                    body:formData,
                    signal
                });
            }else{
                fetchCB = fetch(endPointPrefix+endpoint,{
                    method,
                    body:formData,
                    signal
                });
            }
        }else{
            fetchCB = fetch(endPointPrefix+endpoint);
        }
    }

    return new Promise((resolve,reject)=>{
        fetchCB
        .then(res=>{
            if(res.status==404){
                swal("Code: 404","Não foi possivel completar a requisição porque o recurso não foi encontrado","warning");
                reject(res.status)
            }else if(res.status==401){
                requestLogin();
                reject(res.status)
            }
            else{
                return res.json();
            }
        })
        .then((data:IHttpRequestResponse<T>)=>{
            if(
                data.status==403 && 
                (typeof data?.redirectTo != "undefined" && data.redirectTo=="login")
            ){
                requestLogin();
                reject(data.status);
            }else if(data.status==403){
                swal("Code: 403",data.message,"warning");
                reject(data.status);
            }else if(data.status==400){
                badRequestHandle(data,htmlElement);
                reject(data);
            }else if(data.status==500){
                swal("Code: 500","Serviços temporariamente indisponivel","error");
                console.error(data);
                reject(data.status);
            }
            else{
                if([200,201].includes(data.status))resolve(data);
                else{
                    swal("Erro inesperado","Um erro inesperado ocoreu, tente denovo mais tarde","error");
                    console.error(data);
                    reject(data.status);
                }
            }
        })
        .catch(error=>{
            reject(error);
        });
    })
}

function requestLogin(){
    swal("Code: 401","Tens de realizar o Login primeiro","warning");
    logout();
}

export function badRequestHandle<T>(dataResponse:IHttpRequestResponse<T>,htmlElement:HTMLElement|undefined){
    if(typeof dataResponse?.errorFeedback != "undefined" && dataResponse?.errorFeedback.length){
        let objError:formErrorSpreadObj = {}

        for (const {formControll,feedbackMSG} of dataResponse?.errorFeedback) {
            objError[formControll] = feedbackMSG
        }

        displayErrorsFeedback(objError,htmlElement,true);

    }else{
        swal("Erro na requisição",dataResponse.message,"warning");
    }
}

export function displayErrorsFeedback(
    objError:formErrorSpreadObj,
    htmlElement:HTMLElement|undefined,
    scroll=false,
    ms:number|string = 3000
){
    if(typeof htmlElement!== "undefined"){
        let errorsNotDisplayed :formErrorSpreadObj = {}
        Object.keys(objError).forEach(keyError=>{
            let elementErrorFeedback = htmlElement?.querySelector(`[data-error-feedback="${keyError}"]`) as HTMLElement;

            console.log("ms clear",ms);

            if(!showTextInElementFeedback(elementErrorFeedback,objError[keyError],ms)){
                errorsNotDisplayed[keyError] = objError[keyError];
            }

            if (scroll) {
                let elementToScrollTo = htmlElement.querySelector(`[data-error-feedback]:not(.d-none)`);
                // Role o elemento para a visualização com comportamento suave
                //elementErrorFeedback?.scrollIntoView({ behavior: "smooth" });
                elementToScrollTo?.scrollIntoView({ behavior: "smooth",block: "center" });

                // Use um timeout para ajustar a rolagem após a rolagem suave
                setTimeout(() => {
                    window.scrollBy({ top: -250, behavior: "smooth" });
                }, 500); // Ajuste o tempo conforme necessário para coincidir com a rolagem suave
            }

        });

        if(Object.keys(errorsNotDisplayed).length){
            showErrorsInAlert(errorsNotDisplayed);
        }
    }else{
        showErrorsInAlert(objError);
    }
}

export function showTextInElementFeedback(elementFeedback:HTMLElement,msgText:string,ms:number|string=3000){
    if(elementFeedback){
        elementFeedback.classList.remove("d-none");
        elementFeedback.innerText = msgText;

        if(typeof ms == "number" && ms>0){
            setTimeout(()=>{
                elementFeedback.classList.add("d-none");
            },ms);
        }

        return true;
    }
    return false;
}

function showErrorsInAlert(objError:formErrorSpreadObj){
    let divElemnt = document.createElement("div");
    let errorHtmlTemplateArr = [];
    errorHtmlTemplateArr = Object.entries(objError).map(valuesArr=>{
        return `
            <div>
                <b>${valuesArr[0]}: </b><span>${valuesArr[1]}</span>
            </div>
        `;
    })
    divElemnt.insertAdjacentHTML("beforeend",errorHtmlTemplateArr.join(""));
    
    swal({
        title:"Erro no formulário submetido",
        content: {
            element:divElemnt
        }
    });
}