import getCurrentPageName from "./utils/getCurrentPageName";
import loaderInContainer from "./utils/loaderElementActions";

let bodyAlunos = document.querySelector(".alunos") as HTMLElement;

let containerProfileAluno = bodyAlunos?.querySelector(".container-profile-aluno") as HTMLDivElement;
let containerTabBtn = bodyAlunos?.querySelector(".container-tab-btn") as HTMLDivElement;
let containerTab = bodyAlunos?.querySelector(".container-tab") as HTMLDivElement;
let cursoLista = containerTab?.querySelector(".curso-lista") as  HTMLDivElement;
let filterPropinas = containerTab?.querySelector(".filter-propinas") as HTMLDivElement;

let btnUpdateContactInfoUser = containerProfileAluno?.querySelector(".btn-update-info") as HTMLButtonElement;
let btnUpdatePasswordUser = containerProfileAluno?.querySelector(".btn-update-pass") as HTMLButtonElement;
let btnUserLogout = containerProfileAluno?.querySelector(".btn-logout") as HTMLButtonElement;

export function actionAlunosPage(){
    if(getCurrentPageName()=="alunos"){
        isAlunoLogged();

        onBtnsUserProfileClicked();
        onContainerTabBtnClicked();
        onCursoItemClicked();
        onCursoItemClickedFilterPropinas();

        onTabPagamentosPropinasClicked();
    }
}

function onBtnsUserProfileClicked(){
    btnUpdateContactInfoUser?.addEventListener("click",()=>{
        swal("modal update contact info user")
    });

    btnUpdatePasswordUser?.addEventListener("click",()=>{
        swal("modal update password user")
    });


    btnUserLogout?.addEventListener("click",()=>{
        swal({
            title: "Terminar sessão",
            text: "Tens a certeza que pretendes realizar Log Out?",
            dangerMode:true,
            buttons: ["Não", "Sim"]
        })
        .then((willDelete) => {
            if (willDelete) {
                window.location.href = "login-aluno.html";
            }
        });
    });
}

function onContainerTabBtnClicked(){
    containerTabBtn.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        if(elementClicked.classList.contains("btn-tab") && !elementClicked.classList.contains("active")){
            let idTabToShow = (elementClicked.dataset?.tabId??"").trim();

            if(idTabToShow){
                containerTabBtn.querySelector(".active")?.classList.remove("active");
                elementClicked.classList.add("active");

                containerTab.querySelectorAll(".tab-item").forEach(tabEl=>{
                    tabEl.classList.add("d-none");
                });

                containerTab.querySelector(`[data-tab="${idTabToShow}"]`)?.classList.remove("d-none");

                loaderInContainer(containerTab,"show");
                setTimeout(()=>{
                    loaderInContainer(containerTab,"hide");
                },2000)
            }
        }
    })
}

function onCursoItemClicked(){
    cursoLista.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        let idCurso = "";
        if(elementClicked.classList.contains("curso-item")){
            idCurso = (elementClicked.dataset?.idCurso??"").trim();
        }else{
            let parentElement = elementClicked.closest(".curso-item") as HTMLDivElement;
            idCurso = (parentElement.dataset?.idCurso??"").trim();
            elementClicked = parentElement;
        }

        if(!elementClicked.classList.contains("active") && idCurso){
            cursoLista.querySelector(".active")?.classList.remove("active");
            elementClicked.classList.add("active");
            loaderInContainer(containerTab,"show");
            setTimeout(()=>{
                loaderInContainer(containerTab,"hide");
                swal("load notas curso ID: "+idCurso);
            },2000)
        }
    })
}

function onCursoItemClickedFilterPropinas(){
    filterPropinas.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        let idCurso = "";
        if(elementClicked.classList.contains("curso-item")){
            idCurso = (elementClicked.dataset?.idCurso??"").trim();
        }else{
            let parentElement = elementClicked.closest(".curso-item") as HTMLDivElement;
            idCurso = (parentElement.dataset?.idCurso??"").trim();
            elementClicked = parentElement;
        }

        if(!elementClicked.classList.contains("active") && idCurso){
            filterPropinas.querySelector(".active")?.classList.remove("active");
            elementClicked.classList.add("active");
            loaderInContainer(containerTab,"show");
            setTimeout(()=>{
                loaderInContainer(containerTab,"hide");
                swal("load propinas curso ID: "+idCurso);
            },2000)
        }
    })
}

function onTabPagamentosPropinasClicked(){
    containerTab.addEventListener("click",(e)=>{
        let elementClicked = e.target as HTMLElement;

        if(elementClicked.classList.contains("fa-credit-card")){
            let proprinaId = (elementClicked.dataset?.proprinaId??"").trim();

            swal("modal efetuar pagamentos vinti4 ID: "+proprinaId);
        }else if(elementClicked.classList.contains("fa-receipt")){
            let pagamentoId = (elementClicked.dataset?.pagamentoId??"").trim();

            swal("modal download recibo pagamento: "+pagamentoId);
        }
    })
}

function isAlunoLogged(){
    let isLogged = true;

    if(isLogged){

        setTimeout(()=>{
            loaderInContainer(containerProfileAluno,"hide");
            loaderInContainer(containerTab,"hide");
        },2000);
    }else{
        
        swal ( "Oops" ,  "Tens de realizar login primeiro" ,  "warning" )
        .then(()=>{
            window.location.href = "login-aluno.html";
        });

    }
}