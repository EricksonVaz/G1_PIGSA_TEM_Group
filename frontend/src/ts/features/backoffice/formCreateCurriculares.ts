import { displayErrorsFeedback } from "../utils/HttpRequest";
import loaderInContainer from "../utils/loaderElementActions";

let backofficeBadyElem = document.querySelector(".back-office") as HTMLElement;
let containerTab = backofficeBadyElem?.querySelector(".container-tab") as HTMLDivElement;

let formCreateCurriculares = containerTab?.querySelector(".form-create-curriculares") as HTMLFormElement;
let btnCreateUC = formCreateCurriculares?.querySelector(".btn-create") as HTMLButtonElement;
let btnUpdateUC = formCreateCurriculares?.querySelector(".btn-update") as HTMLButtonElement;

let listCurricularesContainer = containerTab?.querySelector(".list-curriculares") as HTMLDivElement;

export function submitFormUCCreateUpdate(){
    formCreateCurriculares?.addEventListener("submit",(e)=>{
        let isToCreate = (btnUpdateUC.classList.contains("d-none") && !btnCreateUC.classList.contains("d-none"))

        if(isToCreate){
            actionCreateUC();
        }else{
            actionUpdateUC();
        }
    });

    btnCreateUC?.addEventListener("click",actionCreateUC);

    btnUpdateUC?.addEventListener("click",actionUpdateUC);
}

export function actionListCurricularesContainer(){
    listCurricularesContainer?.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        if(elementClicked.classList.contains("delete")){
            let parentElement = elementClicked.closest(".curriculares-item") as HTMLElement;
            let idUCToDelete = +(parentElement.dataset?.idUc??"0");

            if(idUCToDelete>0){
                swal({
                    title: "Eliminar Unidade Curricular",
                    text: "Tens a certeza que pretende eliminar esta unidade curricular?",
                    dangerMode:true,
                    buttons: ["Não", "Sim"]
                })
                .then((willDelete) => {
                    if (willDelete) {
                        loaderInContainer(listCurricularesContainer,"show");
                        formCreateUpdateUCReset();

                        setTimeout(()=>{
                            swal("Delete UC: "+idUCToDelete);

                            loaderInContainer(listCurricularesContainer,"hide");
                        },3000)
                    }
                });
                
            }else{
                swal("ID UC Inválido");
            }
        }else if(elementClicked.classList.contains("update")){
            let parentElement = elementClicked.closest(".curriculares-item") as HTMLElement;
            let idUCToUpdate = +(parentElement.dataset?.idUc??"0");
            let nomeUC = (parentElement.dataset?.nomeUc ?? "").trim();
            let faculdade = (parentElement.dataset?.faculdade ?? "").trim();

            if(idUCToUpdate>0 && nomeUC && faculdade){
                btnCreateUC?.classList.add("d-none");
                btnUpdateUC?.classList.remove("d-none");

                console.log("btnUpdateUC",btnUpdateUC)

                loadFormUpdateUC(""+idUCToUpdate,nomeUC,faculdade);

            }else{
                swal("Dados UC Inválidos");
            }

        }
    })
}

function actionCreateUC(){
    let formData = new FormData(formCreateCurriculares);

    let nomeUC = (formData.get("nome-curriculares") as string).trim();
    let faculdadeUC = (formData.get("faculdade") as string).trim();

    let formHasError = false;

    if(!nomeUC){
        displayErrorsFeedback({"nome-curriculares":"Campo obrigatório"},formCreateCurriculares!);
        formHasError=true;
    }

    if(!faculdadeUC){
        displayErrorsFeedback({faculdade:"Campo obrigatório"},formCreateCurriculares!);
        formHasError = true;
    }

    if(!formHasError){
        loaderInContainer(listCurricularesContainer,"show");

        btnCreateUC.disabled = true;

        setTimeout(()=>{
            console.log("form data create",formData);
            swal("submit form create UC");

            loaderInContainer(listCurricularesContainer,"hide");

            formCreateUpdateUCReset()
        },3000);
    }
}

function actionUpdateUC(){
    let formData = new FormData(formCreateCurriculares);

    let nomeUC = (formData.get("nome-curriculares") as string).trim();
    let faculdadeUC = (formData.get("faculdade") as string).trim();

    let formHasError = false;

    if(!nomeUC){
        displayErrorsFeedback({"nome-curriculares":"Campo obrigatório"},formCreateCurriculares!);
        formHasError=true;
    }

    if(!faculdadeUC){
        displayErrorsFeedback({faculdade:"Campo obrigatório"},formCreateCurriculares!);
        formHasError = true;
    }

    if(!formHasError){
        loaderInContainer(listCurricularesContainer,"show");

        btnUpdateUC.disabled = true;

        setTimeout(()=>{
            console.log("form data update",formData);
            swal("submit form update UC");

            loaderInContainer(listCurricularesContainer,"hide");

            formCreateUpdateUCReset();
        },3000);
    }
}

function loadFormUpdateUC(idUC:string,nomeUC:string,faculdadeUC:string){
    let idUCInput = formCreateCurriculares.querySelector<HTMLInputElement>(`[name="id-uc"]`);
    let nomeUCInput = formCreateCurriculares.querySelector<HTMLInputElement>(`[name="nome-curriculares"]`);
    let faculdadeUCInput = formCreateCurriculares.querySelector<HTMLInputElement>(`[name="faculdade"]`);


    if(idUCInput)idUCInput.value = idUC;
    if(nomeUCInput)nomeUCInput.value = nomeUC;
    if(faculdadeUCInput)faculdadeUCInput.value = faculdadeUC;
}

export function formCreateUpdateUCReset(){
    formCreateCurriculares.reset();
    btnCreateUC?.classList.remove("d-none");
    btnUpdateUC?.classList.add("d-none");

    btnCreateUC.disabled = false;
    btnUpdateUC.disabled = false;
}