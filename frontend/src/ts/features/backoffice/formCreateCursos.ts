import { displayErrorsFeedback } from "../utils/HttpRequest";
import loaderInContainer from "../utils/loaderElementActions";

let backofficeBadyElem = document.querySelector(".back-office") as HTMLElement;
let containerTab = backofficeBadyElem?.querySelector(".container-tab") as HTMLDivElement;

let formCreateCourse = containerTab?.querySelector(".form-create-cursos") as HTMLFormElement;
let btnCreateCourse = formCreateCourse?.querySelector(".btn-create") as HTMLButtonElement;
let btnUpdatCourse = formCreateCourse?.querySelector(".btn-update") as HTMLButtonElement;

let listCourseContainer = containerTab?.querySelector(".list-cursos") as HTMLDivElement;

let validGrauCourseArr = ["licenciatura", "mestrado", "doutorado"];

export function submitFormCourseCreateUpdate(){
    formCreateCourse?.addEventListener("submit",(e)=>{
        let isToCreate = (btnUpdatCourse.classList.contains("d-none") && !btnCreateCourse.classList.contains("d-none"))

        if(isToCreate){
            actionCreateCourse();
        }else{
            actionUpdateCourse();
        }
    });

    btnCreateCourse?.addEventListener("click",actionCreateCourse);

    btnUpdatCourse?.addEventListener("click",actionUpdateCourse);
}

export function actionListCourseContainer(){
    listCourseContainer?.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        if(elementClicked.classList.contains("delete")){
            let parentElement = elementClicked.closest(".cursos-item-list") as HTMLElement;
            let idCourseToDelete = +(parentElement.dataset?.idCurso??"0");

            if(idCourseToDelete>0){
                swal({
                    title: "Eliminar Curso",
                    text: "Tens a certeza que pretende eliminar este curso?",
                    dangerMode:true,
                    buttons: ["Não", "Sim"]
                })
                .then((willDelete) => {
                    if (willDelete) {
                        loaderInContainer(listCourseContainer,"show");
                        formCreateUpdateCourseReset();

                        setTimeout(()=>{
                            swal("Delete Curso: "+idCourseToDelete);

                            loaderInContainer(listCourseContainer,"hide");

                        },3000)
                    }
                });
                
            }else{
                swal("ID Curso Inválido");
            }
        }else if(elementClicked.classList.contains("update")){
            let parentElement = elementClicked.closest(".cursos-item-list") as HTMLElement;
            let idCourseToUpdate = +(parentElement.dataset?.idCurso??"0");
            let nomeCourse = (parentElement.dataset?.nomeCurso ?? "").trim();
            let faculdadeCurso = (parentElement.dataset?.faculdadeCurso ?? "").trim();
            let grauCurso = (parentElement.dataset?.grauCurso ?? "").trim().toLowerCase();
            let semestreCurso = +(parentElement.dataset?.semestreCurso ?? "0");

            if(idCourseToUpdate>0 && nomeCourse && faculdadeCurso && validGrauCourseArr.includes(grauCurso) && semestreCurso>0){
                btnCreateCourse?.classList.add("d-none");
                btnUpdatCourse?.classList.remove("d-none");


                loadFormUpdateCourse(""+idCourseToUpdate,nomeCourse,faculdadeCurso,grauCurso,""+semestreCurso);

            }else{
                swal("Dados Curso Inválidos");
            }

        }else if(elementClicked.classList.contains("add")){
            swal("modal add disciplinas");
        }
    })
}

function actionCreateCourse(){
    let formData = new FormData(formCreateCourse);

    let nomeCurso = (formData.get("nome-curso") as string).trim();
    let faculdadeCurso = (formData.get("faculdade-curso") as string).trim();
    let grauCurso = (formData.get("grau-curso") as string).trim();
    let semestresCurso = +(formData.get("semestres-curso") as string).trim();

    let formHasError = false;

    if(!nomeCurso){
        displayErrorsFeedback({"nome-curso":"Campo obrigatório"},formCreateCourse!);
        formHasError=true;
    }

    if(!faculdadeCurso){
        displayErrorsFeedback({"faculdade-curso":"Campo obrigatório"},formCreateCourse!);
        formHasError = true;
    }

    if(!validGrauCourseArr.includes(grauCurso)){
        displayErrorsFeedback({"grau-curso":"Campo inválido"},formCreateCourse!);
        formHasError = true;
    }

    if(semestresCurso<=0){
        displayErrorsFeedback({"semestres-curso":"Campo obrigatório"},formCreateCourse!);
        formHasError = true;
    }

    if(!formHasError){
        loaderInContainer(listCourseContainer,"show");

        btnCreateCourse.disabled = true;
        setTimeout(()=>{
            console.log("form data create",formData);
            swal("submit form create Curso");

            loaderInContainer(listCourseContainer,"hide");

            formCreateUpdateCourseReset()
        },3000);
    }
}

function actionUpdateCourse(){
    let formData = new FormData(formCreateCourse);

    let nomeCurso = (formData.get("nome-curso") as string).trim();
    let faculdadeCurso = (formData.get("faculdade-curso") as string).trim();
    let grauCurso = (formData.get("grau-curso") as string).trim();
    let semestresCurso = +(formData.get("semestres-curso") as string).trim();

    let formHasError = false;

    if(!nomeCurso){
        displayErrorsFeedback({"nome-curso":"Campo obrigatório"},formCreateCourse!);
        formHasError=true;
    }

    if(!faculdadeCurso){
        displayErrorsFeedback({"faculdade-curso":"Campo obrigatório"},formCreateCourse!);
        formHasError = true;
    }

    if(!validGrauCourseArr.includes(grauCurso)){
        displayErrorsFeedback({"grau-curso":"Campo inválido"},formCreateCourse!);
        formHasError = true;
    }

    if(semestresCurso<=0){
        displayErrorsFeedback({"semestres-curso":"Campo obrigatório"},formCreateCourse!);
        formHasError = true;
    }

    if(!formHasError){
        loaderInContainer(listCourseContainer,"show");
        btnUpdatCourse.disabled = true;

        setTimeout(()=>{
            console.log("form data update",formData);
            swal("submit form update Curso");

            loaderInContainer(listCourseContainer,"hide");

            formCreateUpdateCourseReset();
        },3000);
    }
}

function loadFormUpdateCourse(idCurso:string,nomeCurso:string,faculdadeCurso:string,grauCurso:string,semestreCurso:string){
    let idCursoInput = formCreateCourse.querySelector<HTMLInputElement>(`[name="id-curso"]`);
    let nomeCursoInput = formCreateCourse.querySelector<HTMLInputElement>(`[name="nome-curso"]`);
    let faculdadeCursoInput = formCreateCourse.querySelector<HTMLInputElement>(`[name="faculdade-curso"]`);
    let grauCursoInput = formCreateCourse.querySelector<HTMLInputElement>(`[name="grau-curso"]`);
    let semestreCursoInput = formCreateCourse.querySelector<HTMLInputElement>(`[name="semestres-curso"]`);


    if(idCursoInput)idCursoInput.value = idCurso;
    if(nomeCursoInput)nomeCursoInput.value = nomeCurso;
    if(faculdadeCursoInput)faculdadeCursoInput.value = faculdadeCurso;
    if(grauCursoInput)grauCursoInput.value = grauCurso;
    if(semestreCursoInput)semestreCursoInput.value = semestreCurso;
}

export function formCreateUpdateCourseReset(){
    formCreateCourse.reset();
    btnCreateCourse?.classList.remove("d-none");
    btnUpdatCourse?.classList.add("d-none");

    btnCreateCourse.disabled = false;
    btnUpdatCourse.disabled = false;
}