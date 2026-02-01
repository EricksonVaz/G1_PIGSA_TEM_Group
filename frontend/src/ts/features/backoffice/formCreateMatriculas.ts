import { displayErrorsFeedback } from "../utils/HttpRequest";
import loaderInContainer from "../utils/loaderElementActions";

let backofficeBadyElem = document.querySelector(".back-office") as HTMLElement;
let containerTab = backofficeBadyElem?.querySelector(".container-tab") as HTMLDivElement;

let formCreateMatriculas = containerTab?.querySelector(".form-create-matriculas") as HTMLFormElement;
let btnCreateCourse = formCreateMatriculas?.querySelector(".btn-create") as HTMLButtonElement;

let listAlunosContainer = containerTab?.querySelector(".list-alunos") as HTMLDivElement;

export function submitFormCreateAluno(){
    formCreateMatriculas?.addEventListener("submit",(e)=>{
        actionCreateAluno();
    });

    btnCreateCourse?.addEventListener("click",actionCreateAluno);
}

export function actionListAlunosContainer(){
    listAlunosContainer?.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        if(elementClicked.classList.contains("delete")){
            let parentElement = elementClicked.closest(".aluno-info-item") as HTMLElement;
            let idAlunoToDelete = +(parentElement.dataset?.idAluno??"0");

            if(idAlunoToDelete>0){
                swal({
                    title: "Eliminar Aluno",
                    text: "Tens a certeza que pretende eliminar este Aluno?",
                    dangerMode:true,
                    buttons: ["Não", "Sim"]
                })
                .then((willDelete) => {
                    if (willDelete) {
                        loaderInContainer(listAlunosContainer,"show");

                        formCreateAlunoReset();

                        setTimeout(()=>{
                            swal("Delete Aluno: "+idAlunoToDelete);

                            loaderInContainer(listAlunosContainer,"hide");

                        },3000)
                    }
                });
                
            }else{
                swal("ID Aluno Inválido");
            }
        }else if(elementClicked.classList.contains("edit")){
            swal("modal edit aluno matricula");
        }
    })
}

function actionCreateAluno(){
    let formData = new FormData(formCreateMatriculas);

    let nomeAlunoCompleto = (formData.get("aluno-nome") as string).trim();
    let nascimento = (formData.get("aluno-nascimento") as string).trim();
    let nif = (formData.get("aluno-nif") as string).trim();

    let formHasError = false;

    if(!nomeAlunoCompleto){
        displayErrorsFeedback({"aluno-nome":"Campo obrigatório"},formCreateMatriculas!);
        formHasError=true;
    }

    if(!nascimento){
        displayErrorsFeedback({"aluno-nascimento":"Campo obrigatório"},formCreateMatriculas!);
        formHasError = true;
    }

    if(isNaN(+nif) || nif.length<9 ){
        displayErrorsFeedback({"aluno-nif":"Campo inválido"},formCreateMatriculas!);
        formHasError = true;
    }

    if(!formHasError){
        loaderInContainer(listAlunosContainer,"show");

        btnCreateCourse.disabled = true;

        setTimeout(()=>{
            console.log("form data create",formData);
            swal("submit form create aluno");

            loaderInContainer(listAlunosContainer,"hide");

            formCreateAlunoReset()
        },3000);
    }
}

export function formCreateAlunoReset(){
    formCreateMatriculas.reset();

    btnCreateCourse.disabled = false;
}