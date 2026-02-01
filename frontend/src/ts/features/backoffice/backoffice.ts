import getCurrentPageName from "../utils/getCurrentPageName";
import { actionListCurricularesContainer, formCreateUpdateUCReset, submitFormUCCreateUpdate } from "./formCreateCurriculares";
import { actionListCourseContainer, formCreateUpdateCourseReset, submitFormCourseCreateUpdate } from "./formCreateCursos";
import { actionListAlunosContainer, formCreateAlunoReset, submitFormCreateAluno } from "./formCreateMatriculas";
import { onClikedBtnOpenModalPublishNota, onFilterItemCursoCliked } from "./notasAlunos";

let backofficeBadyElem = document.querySelector(".back-office") as HTMLElement;
let containerButtons = backofficeBadyElem?.querySelector(".container-buttons") as HTMLDivElement;
let containerTab = backofficeBadyElem?.querySelector(".container-tab") as HTMLDivElement;

export function actionsOnBackofficiePage(){

    if(getCurrentPageName()=="backoffice"){
        actionsShowTabClicked();

        submitFormUCCreateUpdate();
        actionListCurricularesContainer();

        submitFormCourseCreateUpdate();
        actionListCourseContainer();

        submitFormCreateAluno();
        actionListAlunosContainer();

        onFilterItemCursoCliked();
        onClikedBtnOpenModalPublishNota();
    }
}

function actionsShowTabClicked(){
    if(containerButtons){
        containerButtons.addEventListener("click",(e)=>{
            let elementCliceked = e.target as HTMLElement;

            if(elementCliceked.classList.contains("btn-action") && !elementCliceked.classList.contains("active")){

                containerButtons.querySelector(".active")?.classList.remove("active");
                elementCliceked.classList.add("active");

                let tabElementToShow = (elementCliceked.dataset?.tabId??"").trim();

                containerTab.querySelectorAll(".tab-item").forEach(tabEl=>tabEl.classList.add("d-none"));

                containerTab.querySelector(`[data-tab="${tabElementToShow}"]`)?.classList.remove("d-none");

                formCreateUpdateUCReset();
                formCreateUpdateCourseReset();
                formCreateAlunoReset();
            }
        });
    }
}