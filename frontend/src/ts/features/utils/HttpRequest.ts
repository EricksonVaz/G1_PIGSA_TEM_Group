import swal from "sweetalert";
//import { logout } from "./Auth";

export interface IErrorFeedback{
    formControll:string,
    feedbackMSG:string
}

export interface IPaginationInfo{
    page:number,
    totalPage:number,
    perPage:number,
    total:number,
    navigationLink:string
}

export interface IHttpRequestResponse<T>{
    status:number,
    message:string,
    redirectTo?:string,
    jwt?:string
    errorFeedback?:IErrorFeedback[]
    type?:string,
    paginationInfo?:IPaginationInfo
    result?:T[],
    error?:Object,
    lastIDInserted?:number,
    lastNameInserted?:string,
    newKey?:string,
    accessLevel?:number

}

export type formErrorSpreadObj = {[key:string]:string};

export let httpRequestcontroller:AbortController;

export let endPointPrefix = (function(){
    if(["localhost","127.0.0.1"].includes(window.location.hostname)){
        return "http://localhost:3000";
    }else if(["192.168.1.248"].includes(window.location.hostname)){
         return "http://192.168.1.248:3000";
    }else{
        return "https://mynodejs.host";
    }
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
        let jwtToken = localStorage.getItem("jwt-csuplataform");

        if(typeof formData!=="undefined"){
            if(typeof formData == "string"){
                fetchCB = fetch(endPointPrefix+endpoint,{
                    method,
                    headers:{
                        "Authorization":`Bearer ${jwtToken}`,
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
                    },
                    body:formData,
                    signal
                });
            }

        }else{
            fetchCB = fetch(endPointPrefix+endpoint,{
                method,
                headers:{
                    "Authorization":`Bearer ${jwtToken}`
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
    swal("Code: 401","Efectue o Login primeiro","warning");
    //logout();
}

export function badRequestHandle<T>(dataResponse:IHttpRequestResponse<T>,htmlElement:HTMLElement|undefined){
    if(typeof dataResponse?.errorFeedback != "undefined" && dataResponse?.errorFeedback.length){
        let objError:formErrorSpreadObj = {}

        for (const {formControll,feedbackMSG} of dataResponse?.errorFeedback) {
            objError[formControll] = feedbackMSG
        }

        displayErrorsFeedback(objError,htmlElement);

    }else{
        swal("Erro na requisição",dataResponse.message,"warning");
    }
}

export function displayErrorsFeedback(objError:formErrorSpreadObj,htmlElement:HTMLElement|undefined){
    if(typeof htmlElement!== "undefined"){
        let errorsNotDisplayed :formErrorSpreadObj = {}
        Object.keys(objError).forEach(keyError=>{
            let elementErrorFeedback = htmlElement?.querySelector(`[data-error-feedback="${keyError}"]`) as HTMLElement;

            if(!showTextInElementFeedback(elementErrorFeedback,objError[keyError])){
                errorsNotDisplayed[keyError] = objError[keyError];
            }
        });

        if(Object.keys(errorsNotDisplayed).length){
            showErrorsInAlert(errorsNotDisplayed);
        }
    }else{
        showErrorsInAlert(objError);
    }
}

export function showTextInElementFeedback(elementFeedback:HTMLElement,msgText:string,ms=3000){
    if(elementFeedback){
        elementFeedback.classList.remove("d-none");
        elementFeedback.innerText = msgText;

        setTimeout(()=>{
            elementFeedback.classList.add("d-none");
        },ms);

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
        title:"Erro no formulario submetido",
        content: {
            element:divElemnt
        }
    });
}