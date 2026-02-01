import { jwtDecoded } from "../../utils/functions/Auth";

const globalIcon = new URL("../../../img/globe.png?as=png&width=35px&height=35px",import.meta.url);

const cmBR = new URL("../../../img/cm/transparente/cmBR.png?as=png&width=35px&height=35px",import.meta.url);
const cmBV = new URL("../../../img/cm/transparente/cmBV.png?as=png&width=35px&height=35px",import.meta.url);
const cmMA = new URL("../../../img/cm/transparente/cmMA.png?as=png&width=35px&height=35px",import.meta.url);
const cmMO = new URL("../../../img/cm/transparente/cmMO.png?as=png&width=35px&height=35px",import.meta.url);
const cmPA = new URL("../../../img/cm/transparente/cmPA.png?as=png&width=35px&height=35px",import.meta.url);
const cmPN = new URL("../../../img/cm/transparente/cmPN.png?as=png&width=35px&height=35px",import.meta.url);
const cmPR = new URL("../../../img/cm/transparente/cmPR.png?as=png&width=35px&height=35px",import.meta.url);
const cmRBSN = new URL("../../../img/cm/transparente/cmRBSN.png?as=png&width=35px&height=35px",import.meta.url);
const cmRGSA = new URL("../../../img/cm/transparente/cmRGSAV2.png?as=png&width=35px&height=35px",import.meta.url);
const cmRGST = new URL("../../../img/cm/transparente/cmRGST.png?as=png&width=35px&height=35px",import.meta.url);
const cmSal = new URL("../../../img/cm/transparente/cmSal.png?as=png&width=35px&height=35px",import.meta.url);
const cmSC = new URL("../../../img/cm/transparente/cmSC.png?as=png&width=35px&height=35px",import.meta.url);
const cmSCFG = new URL("../../../img/cm/transparente/cmSCFG.png?as=png&width=35px&height=35px",import.meta.url);
const cmSCST = new URL("../../../img/cm/transparente/cmSCST.png?as=png&width=35px&height=35px",import.meta.url);
const cmSD = new URL("../../../img/cm/transparente/cmSD.png?as=png&width=35px&height=35px",import.meta.url);
const cmSFFG = new URL("../../../img/cm/transparente/cmSFFG.png?as=png&width=35px&height=35px",import.meta.url);
const cmSLO = new URL("../../../img/cm/transparente/cmSLO.png?as=png&width=35px&height=35px",import.meta.url);
const cmSM = new URL("../../../img/cm/transparente/cmSM.png?as=png&width=35px&height=35px",import.meta.url);
const cmSSM = new URL("../../../img/cm/transparente/cmSSM.png?as=png&width=35px&height=35px",import.meta.url);
const cmSV = new URL("../../../img/cm/transparente/cmSV.png?as=png&width=35px&height=35px",import.meta.url);
const cmTSN = new URL("../../../img/cm/transparente/cmTSN.png?as=png&width=35px&height=35px",import.meta.url);
const cmTST = new URL("../../../img/cm/transparente/cmTST.png?as=png&width=35px&height=35px",import.meta.url);


export function filterRegionContainer(){
    return `
        <div class="filter-region-container">
            <div class="filter-item" data-concelho="Nacional">
                <span class="icon-container fitem">
                    <img src="${globalIcon}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Nacional
                </span>
            </div>
            <div class="filter-item" data-concelho="Brava">
                <span class="icon-container fitem">
                    <img src="${cmBR}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Brava
                </span>
            </div>
            <div class="filter-item" data-concelho="Boavista">
                <span class="icon-container fitem">
                    <img src="${cmBV}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Boa Vista
                </span>
            </div>
            <div class="filter-item" data-concelho="Maio">
                <span class="icon-container fitem">
                    <img src="${cmMA}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Maio
                </span>
            </div>
            <div class="filter-item" data-concelho="Mosteiros">
                <span class="icon-container fitem">
                    <img src="${cmMO}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Mosteiros
                </span>
            </div>
            <div class="filter-item" data-concelho="Paul">
                <span class="icon-container fitem">
                    <img src="${cmPA}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Paul
                </span>
            </div>
            <div class="filter-item" data-concelho="Porto Novo">
                <span class="icon-container fitem">
                    <img src="${cmPN}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Porto Novo
                </span>
            </div>
            <div class="filter-item" data-concelho="Praia">
                <span class="icon-container fitem">
                    <img src="${cmPR}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Praia
                </span>
            </div>
            <div class="filter-item" data-concelho="Ribeira Brava">
                <span class="icon-container fitem">
                    <img src="${cmRBSN}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Ribeira Brava de São Nicolau
                </span>
            </div>
            <div class="filter-item" data-concelho="Ribeira Grande">
                <span class="icon-container fitem">
                    <img src="${cmRGSA}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Ribeira Grande de Santo Antão
                </span>
            </div>
            <div class="filter-item" data-concelho="Ribeira Grande Santiago">
                <span class="icon-container fitem">
                    <img src="${cmRGST}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Ribeira Grande de Santiago
                </span>
            </div>
            <div class="filter-item" data-concelho="Sal">
                <span class="icon-container fitem">
                    <img src="${cmSal}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Sal
                </span>
            </div>
            <div class="filter-item" data-concelho="Santa Cruz">
                <span class="icon-container fitem">
                    <img src="${cmSC}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Santa Cruz
                </span>
            </div>
            <div class="filter-item" data-concelho="Santa Catarina Fogo">
                <span class="icon-container fitem">
                    <img src="${cmSCFG}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Santa Catarina do Fogo
                </span>
            </div>
            <div class="filter-item" data-concelho="Santa Catarina">
                <span class="icon-container fitem">
                    <img src="${cmSCST}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Santa Catarina de Santiago
                </span>
            </div>
            <div class="filter-item" data-concelho="Sao Domingos">
                <span class="icon-container fitem">
                    <img src="${cmSD}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    São Domingos
                </span>
            </div>
            <div class="filter-item" data-concelho="Sao Felipe">
                <span class="icon-container fitem">
                    <img src="${cmSFFG}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    São Filipe do Fogo
                </span>
            </div>
            <div class="filter-item" data-concelho="Sao Lourenco dos Orgaos">
                <span class="icon-container fitem">
                    <img src="${cmSLO}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    São Lourenço dos Orgãos
                </span>
            </div>
            <div class="filter-item" data-concelho="Sao Miguel">
                <span class="icon-container fitem">
                    <img src="${cmSM}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    São Miguel
                </span>
            </div>
            <div class="filter-item" data-concelho="Sao Salvador do Mundo">
                <span class="icon-container fitem">
                    <img src="${cmSSM}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    São Salvador do Mundo
                </span>
            </div>
            <div class="filter-item" data-concelho="Sao Vicente">
                <span class="icon-container fitem">
                    <img src="${cmSV}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    São Vicente
                </span>
            </div>
            <div class="filter-item" data-concelho="Tarrafal Sao Nicolau">
                <span class="icon-container fitem">
                    <img src="${cmTSN}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Tarrafal de São Nicolau
                </span>
            </div>
            <div class="filter-item" data-concelho="Tarrafal Santiago">
                <span class="icon-container fitem">
                    <img src="${cmTST}" alt="img fiter" class="img-filter fitem">
                </span>
                <span class="filter-label fitem">
                    Tarrafal de Santiago
                </span>
            </div>
        </div>
    `
}

export class ActionsFilterRegionContainer{

    private static _rootElement?:HTMLElement;
    static currentConcelhoFilter:string ="Nacional";

    static setRootElement(element:HTMLElement){
        this._rootElement = element;
        this.currentConcelhoFilter = jwtDecoded().jwtBody?.data.concelho ?? "Nacional";
        return this;
    }

    static hideShowFilterRegionElements(callback:Function|undefined=undefined){
        let parentElement = this._rootElement?.querySelector<HTMLDivElement>(".filter-region-container");
        let userConcelho = jwtDecoded().jwtBody?.data.concelho ?? "Nacional";

        parentElement?.querySelectorAll<HTMLDivElement>(".filter-item").forEach((element,index,arr)=>{
            let concelho = (element.dataset?.concelho??"").trim();

            if(concelho==""){
                parentElement?.classList.add("d-none");
                console.error(
                    "Error render filter concelho: um ou mais data-concelho não tem valor de concelho"
                )
                return;
            }else{
                element.classList.add("d-none");
                if(userConcelho=="Nacional"){
                    element.classList.remove("d-none");
                }else if(concelho==userConcelho){
                    element.classList.remove("d-none");
                    element.classList.add("active");

                    ActionsFilterRegionContainer.currentConcelhoFilter = concelho;
                } 
                
                if(concelho=="Nacional"){
                    element.classList.add("active");
                    ActionsFilterRegionContainer.currentConcelhoFilter = concelho;
                }

                if(index==arr.length-1){
                    if(callback)callback();
                }
            }
        });
    }

    static onFilterItemCliked(callback:Function){
        let parentElement = this._rootElement?.querySelector<HTMLDivElement>(".filter-region-container");

        parentElement?.addEventListener("click",(e)=>{
            let elementClicked = e.target as HTMLElement;

            if(elementClicked.classList.contains("filter-item")){
                if(!elementClicked.classList.contains("active")){
                    let concelho = (elementClicked.dataset?.concelho??"").trim();
                    parentElement?.querySelector(".filter-item.active")?.classList.remove("active");

                    elementClicked.classList.add("active");

                    ActionsFilterRegionContainer.currentConcelhoFilter = concelho;

                    callback();
                }
            }else if(elementClicked.classList.contains("fitem")){
                let parentElementClicked = elementClicked.closest<HTMLElement>(".filter-item")!;

                if(!parentElementClicked.classList.contains("active")){
                    let concelho = (parentElementClicked.dataset?.concelho??"").trim();
                    parentElement?.querySelector(".filter-item.active")?.classList.remove("active");

                    parentElementClicked.classList.add("active");

                    ActionsFilterRegionContainer.currentConcelhoFilter = concelho;

                    callback();
                }
            }
        });
    }
}