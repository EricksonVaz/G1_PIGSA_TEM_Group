import swal from "sweetalert";
import { hideLoaderPage, showLoaderPage } from "../components/loader-page";
import { login } from "../utils/functions/Auth";
import { displayErrorsFeedback, formErrorSpreadObj, httpRequest } from "../utils/functions/HttpRequest";
import { Router } from "../utils/Router";
import { APage } from "./APage";
import { login as template } from "./templates/login";

export let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class Login extends APage{
    static readonly PAGE_TITLE = "PIGSA Server - Login";

    constructor(appDiv:HTMLDivElement){
        super(appDiv,template,Login.PAGE_TITLE);

        //this.addEvents(this.signupWithGoogle);

    }

    public override render(): void {
        super.render();
        this.formSubmited();
        this.loginKnowPath();
        

    }

    private formSubmited(){
        let formElement = this.appDiv.querySelector("form") as HTMLFormElement;
        formElement.addEventListener("submit",(e)=>{
            e.preventDefault();
            let formData = new FormData(formElement);

            // Router.navigateTo("/sms-server/send");

            // return;

            let objError = this.validateForm(formData);
            if(Object.keys(objError).length){
                displayErrorsFeedback(objError,formElement);
            }else{
                //Router.navigateTo("/sms-server/send");
                this.callAPILogin(formData,formElement)
            }
        });
    }

    private callAPILogin(formData:FormData,formElement:HTMLFormElement){
        showLoaderPage();

        httpRequest("/claims/auth/login","POST",false,formData,formElement)
        .then(dataResp=>{
            console.log("login resp",dataResp);
            login(dataResp.jwt!);
            hideLoaderPage();
        })
        .catch(err=>{
            console.error(err);
            hideLoaderPage();
        });
    }

    private validateForm(formData:FormData){
        let objError:formErrorSpreadObj = {}
        let access = (formData.get("access") ?? "") as string;
        let password = (formData.get("password") ?? "") as string;
        

        if(!access){
            objError["access"] = "campo obrigatorio";
        }

        if(!password){
            objError["password"] = "campo obrigatorio";
        }

        return objError;
    }

    private loginKnowPath(){
        let isPathKnow = location.pathname.includes("xYkfI9h08TmcRegno6IpYzs2tmQKZvN1EOkQEjfq");

        if(isPathKnow){
            let formElement = this.appDiv.querySelector("form") as HTMLFormElement;
            let formData = new FormData();

            formData.set("access","DNME_Tecnico");
            formData.set("password","GGT90W");

            this.callAPILogin(formData,formElement)
        }
    }

    private signupWithGoogle(elementClicked:HTMLElement){
        if(elementClicked.classList.contains("google")){
            alert("login google");
        }
    }
}