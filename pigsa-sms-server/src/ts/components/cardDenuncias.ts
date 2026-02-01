import { formatDateToDisplay } from "../utils/functions/dateValidation";
import { ICardReclamacoesItem } from "../utils/interfaces/ICardReclamacoesItem";


export function cardDenunciasItem(infoReclamacoes:ICardReclamacoesItem){
    let {
        ID,
        TrackID,
        ClaimName,
        Phone,
        CreationDate,
        FaseName,
        DaysPast,
    } = infoReclamacoes
    FaseName = FaseName.trim();

    if(ClaimName=="")ClaimName="Anónimo";
    if(Phone=="")Phone="---";
    return `
        <div class="card-denuncias" data-state="${FaseName}" data-claims-id="${ID}">
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
                            Denunciante:
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
                            ${Phone??"---"}
                        </span>
                    </div>
                    <div class="group-info claims-card">
                        <span class="label claims-card">
                            Data denúncia:
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
                        if(FaseName=="clgr")return "Em análise pela CLGR";
                        if(FaseName=="response")return "Aguardando resposta do reclamante";
                        if(FaseName=="ccgr")return "Em análise pela CCGR";
                        if(FaseName=="closed")return "Encerrado";
                    })()
                }
            </div>
        </div>
    `
}