import getCurrentPageName from "./utils/getCurrentPageName";
import { displayErrorsFeedback } from "./utils/HttpRequest";
import loaderInContainer from "./utils/loaderElementActions";

let loginContainerForm = document.querySelector(".login-container-form") as HTMLDivElement;

let formLogin = loginContainerForm?.querySelector(".form-login") as HTMLFormElement;


export function actionOnPageLoggin(){

    if(getCurrentPageName()=="login-aluno"){
        isAlunoLogged();

        submitFormLogin();
    }
}

function submitFormLogin(){
    formLogin.addEventListener("submit",(e)=>{
        e.preventDefault();

        let formData = new FormData(formLogin);
        let codigoAluno = (formData.get("code") as string).trim();
        let password = (formData.get("password") as string).trim();

        let formHasError = false;

        if(!codigoAluno){
            displayErrorsFeedback({code:"Campo obrigatório"},formLogin!);
            formHasError=true;
        }

        if(!password){
            displayErrorsFeedback({password:"Campo obrigatório"},formLogin!);
            formHasError=true;
        }

        if(!formHasError){
            loaderInContainer(loginContainerForm,"show");

            setTimeout(()=>{
                window.location.href = "alunos.html";

                loaderInContainer(loginContainerForm,"hide");
            },2000);
        }
    })
}

function isAlunoLogged(){
    let isLogged = false;

    if(isLogged){

        loaderInContainer(loginContainerForm,"show");

        setTimeout(()=>{
            window.location.href = "alunos.html";

            loaderInContainer(loginContainerForm,"hide");
        },2000);
    }
}


