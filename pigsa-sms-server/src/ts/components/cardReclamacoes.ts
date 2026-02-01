import { formatDateToDisplay } from "../utils/functions/dateValidation";
import { ICardReclamacoesItem } from "../utils/interfaces/ICardReclamacoesItem";

function getRandomNumber(min:number, max:number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate the random string in the specified format
function generateRandomString() {
  const part1 = String(getRandomNumber(0, 99)).padStart(2, '0');
  const part2 = String(getRandomNumber(0, 99999)).padStart(5, '0');
  const part3 = String(getRandomNumber(0, 99)).padStart(2, '0');

  return `${part1}-${part2}-${part3}`;
}

export function cardReclamacoes(total=6){
    let arrTemplate:string[] = [];

    let arrState = ["nc","clgr","response","ccgr","closed"];

    for (let index = 0; index < total; index++) {
        let randomNumber = Math.floor(Math.random() * 5);
        let state = arrState[randomNumber];
        let randomID = generateRandomString()
        arrTemplate.push(`
            <div class="card-reclamacoes" data-state="${state}" data-claims-id="${randomID}">
                <div class="container-info claims-card">
                    <div class="counter-day claims-card">
                        ${(function(){
                            if(state=="closed"){
                                return `
                                    <i class="fa-solid fa-circle-check claims-card"></i>
                                `;
                            }

                            return `
                                <span class="label-day claims-card">
                                    366
                                </span>
                                <span class="label-day claims-card">
                                    dias
                                </span>
                            `;
                        })()}
                    </div>
                    <div class="container-details claims-card">
                        <div class="group-info claims-card">
                            <span class="label claims-card">
                                ID:
                            </span>
                            <span class="label-info claims-card">
                                ${randomID}
                            </span>
                        </div>
                        <div class="group-info claims-card">
                            <span class="label claims-card">
                                Reclamante:
                            </span>
                            <span class="label-info claims-card">
                                Erickson de Carvalho Gomes Vaz
                            </span>
                        </div>
                        <div class="group-info claims-card">
                            <span class="label claims-card">
                                Telefone:
                            </span>
                            <span class="label-info claims-card">
                                2641358
                            </span>
                        </div>
                        <div class="group-info claims-card">
                            <span class="label claims-card">
                                Data reclamação:
                            </span>
                            <span class="label-info claims-card">
                                20/12/2022
                            </span>
                        </div>
                    </div>
                </div>
                <div class="container-status claims-card">
                    ${
                        (function(){
                            if(state=="nc")return "Não categorizado";
                            if(state=="clgr")return "Em análise pela CLGR";
                            if(state=="response")return "Aguardando resposta do reclamante";
                            if(state=="ccgr")return "Em análise pela CCGR";
                            if(state=="closed")return "Encerrado";
                        })()
                    }
                </div>
            </div>
        `);
    }

    return arrTemplate.join("");
}

export function cardReclamacoesItem(infoReclamacoes:ICardReclamacoesItem){
    let {
        ID,
        TrackID,
        ClaimName,
        Phone,
        CreationDate,
        FaseName,
        StartedIn,
        DaysPast,
    } = infoReclamacoes
    FaseName = FaseName.trim();
    return `
        <div class="card-reclamacoes" data-state="${FaseName}" data-claims-id="${ID}">
            <div class="container-info claims-card">
                <div class="counter-day claims-card">
                    ${(function(){
                        if(FaseName=="closed"){
                            return `
                                <i class="fa-solid fa-circle-check claims-card"></i>
                            `;
                        }

                        return `
                            <span class="label-day claims-card">
                                ${DaysPast}
                            </span>
                            <span class="label-day claims-card">
                                ${(function(){
                                    if(DaysPast==1)return "dia";

                                    return "dias"
                                })()}
                            </span>
                        `;
                    })()}
                </div>
                <div class="container-details claims-card">
                    <div class="group-info claims-card">
                        <span class="label claims-card">
                            ID:
                        </span>
                        <span class="label-info claims-card">
                            #${TrackID.split("-")[0]}
                        </span>
                    </div>
                    <div class="group-info claims-card">
                        <span class="label claims-card">
                            Reclamante:
                        </span>
                        <span class="label-info claims-card">
                            ${ClaimName}
                        </span>
                    </div>
                    <div class="group-info claims-card">
                        <span class="label claims-card">
                            Telefone:
                        </span>
                        <span class="label-info claims-card">
                            ${Phone}
                        </span>
                    </div>
                    <div class="group-info claims-card">
                        <span class="label claims-card">
                            Data reclamação:
                        </span>
                        <span class="label-info claims-card">
                            ${formatDateToDisplay(CreationDate)}
                        </span>
                    </div>
                </div>
            </div>
            <div class="container-status claims-card">
                ${
                    (function(){
                        if(FaseName=="nc")return "Não categorizado";
                        if(FaseName=="clgr")return "Em análise pela CLGR (desde "+formatDateToDisplay(StartedIn!)+")";
                        if(FaseName=="response")return "Aguardando resposta do reclamante (desde "+formatDateToDisplay(StartedIn!)+")";
                        if(FaseName=="ccgr")return "Em análise pela CCGR (desde "+formatDateToDisplay(StartedIn!)+")";
                        if(FaseName=="closed")return "Encerrado (desde "+formatDateToDisplay(StartedIn!)+")";
                    })()
                }
            </div>
        </div>
    `
}