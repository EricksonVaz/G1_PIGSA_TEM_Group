import { loaderElementContainer } from "../../components/cpanel/loaderElementContainer";
import { mainFooter as componentMainFooter} from "../../components/main-footer";
import { mainHeader as componentMainHeader} from "../../components/main-header";


export let trackSMS =`
    <div id="trackSMS">
        ${componentMainHeader}
        <main class="main-content">
            <div class="container-pannel">
                ${loaderElementContainer()}
                <div class="tab-container">
                    <div class="tab-element track-tab" data-tab="reclamacoes">
                        <div class="container-details">
                            <div class="navigation-tab d-none">
                                <button type="button" class="btn btn-tabnav-inner active">
                                    Fila de execução
                                </button>
                                <button type="button" class="btn btn-tabnav-inner d-none">
                                    Agendados para enviar
                                </button>
                                <button type="button" class="btn btn-tabnav-inner">
                                    Histórico de execução
                                </button>
                            </div>
                            <div class="queue-container queue">
                                <h2 class="label-title">Fila de Execução</h2>
                                <div class="list-container">
                                    
                                </div>
                            </div>
                            <div class="queue-container agenda d-none">
                                <h2 class="label-title">Agendados para enviar</h2>
                                <div class="list-container">
                                    ${(function(){
                                        let arrTemplate = [];

                                        arrTemplate.push(`
                                            <div class="sms-item active">
                                                <div class="sms-info sms-type">
                                                    <span class="label-desc">Tipo de SMS</span>
                                                    <span class="label-info">SMS Simples</span>
                                                </div>
                                                <div class="sms-info">
                                                    <span class="label-desc">Data Criação</span>
                                                    <span class="label-info">21/07/2024</span>
                                                </div>
                                                <div class="sms-info">
                                                        <span class="label-desc">Executar em</span>
                                                        <span class="label-info">21/07/2024 19:12:00</span>
                                                    </div>
                                                <div class="sms-info sms-origin">
                                                    <span class="label-desc">Origem</span>
                                                    <span class="label-info">CSU SMS Client</span>
                                                </div>
                                            </div>
                                        `);

                                        for (let index = 0; index < 4; index++) {
                                            arrTemplate.push(`
                                                <div class="sms-item">
                                                    <div class="sms-info sms-type">
                                                        <span class="label-desc">Tipo de SMS</span>
                                                        <span class="label-info">SMS Simples</span>
                                                    </div>
                                                    <div class="sms-info">
                                                        <span class="label-desc">Data Criação</span>
                                                        <span class="label-info">21/07/2024</span>
                                                    </div>
                                                    <div class="sms-info">
                                                        <span class="label-desc">Executar em</span>
                                                        <span class="label-info">21/07/2024 19:12:00</span>
                                                    </div>
                                                    <div class="sms-info sms-origin">
                                                        <span class="label-desc">Origem</span>
                                                        <span class="label-info">CSU SMS Client</span>
                                                    </div>
                                                </div>
                                            `);
                                        }

                                        return arrTemplate.join("");
                                    })()}
                                </div>
                            </div>
                            <div class="queue-container historico">
                                <h2 class="label-title">Histórico de execução</h2>
                                <div class="list-container">
                                    
                                </div>
                            </div>
                        </div>
                        <div class="container-details container-form d-none">
                            <form class="form-send-sms">
                                <div class="form-group">
                                    <label for="phone">Destinário(s)</label>
                                    <div class="number-added-container">
                                        ${(function(){
                                            let arrPhoneNum = [];

                                            for (let index = 0; index < 6; index++) {
                                                arrPhoneNum.push(`
                                                    <div class="number-item">
                                                        <span class="label-number">
                                                            5911626
                                                        </span>
                                                    </div>    
                                                `);
                                                
                                            }

                                            return arrPhoneNum.join("");
                                        })()}
                                    </div>
                                    <small class="feedback-error d-none" data-error-feedback="phone"></small>
                                </div>
                                <div class="form-group">
                                    <label for="sms">Mensagem</label>
                                    <textarea class="form-control" name="sms" rows="13"></textarea>
                                    <small class="feedback-error d-none" data-error-feedback="sms"></small>
                                </div>
                                <div class="container-btns-form">
                                    <button type="reset" class="btn btn-reset">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        ${componentMainFooter}
    </div>
`;