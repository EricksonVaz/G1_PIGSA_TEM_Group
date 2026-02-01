import loaderInContainer from "../utils/loaderElementActions";

let backofficeBadyElem = document.querySelector(".back-office") as HTMLElement;
let containerTab = backofficeBadyElem?.querySelector(".container-tab") as HTMLDivElement;

let tabNotasContainer = containerTab?.querySelector(`[data-tab="notas"]`) as HTMLElement;
let listCursosFilter = containerTab?.querySelector(".list-cursos-filter") as HTMLDivElement;

let listAlunosMatriculados = containerTab?.querySelector(".list-alunos-matriculados") as HTMLDivElement;



export function onFilterItemCursoCliked(){
    listCursosFilter?.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        if(elementClicked.classList.contains("filter")){
            let filterOp = "";
            if(elementClicked.classList.contains("item-filter")){
                filterOp = (elementClicked.dataset?.filter??"");
            }else{
                let parentElement = elementClicked.closest(".item-filter") as HTMLElement;
                filterOp = (parentElement.dataset?.filter??"");

                elementClicked = parentElement;
            }


            if(filterOp){
                listCursosFilter.querySelector(".active")?.classList.remove("active");

                elementClicked.classList.add("active");

                loaderInContainer(tabNotasContainer,"show");

                setTimeout(()=>{
                    swal("filter op: "+filterOp);
                    loaderInContainer(tabNotasContainer,"hide");
                },3000)
            }
        }
    });
}

export function onClikedBtnOpenModalPublishNota(){
    listAlunosMatriculados?.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        if(elementClicked.classList.contains("publish")){
            let parentElement = elementClicked.closest<HTMLElement>(".alunos-matriculados-item");
            let idAluno = (parentElement?.dataset?.idAluno??"").trim();

            if(idAluno){
                swal("open modal publish nota aluno: "+idAluno)
            }
        }
    });
}