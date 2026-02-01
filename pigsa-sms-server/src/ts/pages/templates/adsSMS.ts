import { loaderElementContainer } from "../../components/cpanel/loaderElementContainer";
import { mainFooter as componentMainFooter} from "../../components/main-footer";
import { mainHeader as componentMainHeader} from "../../components/main-header";


export let adsSMS =`
    <div id="adsSMS">
        ${componentMainHeader}
        <main class="main-content">
            <div class="container-pannel">
                ${loaderElementContainer()}
                <div class="tab-container">
                    <div class="tab-element" data-tab="reclamacoes">
                        <div class="container-form">
                            <form class="form-send-sms">
                                <div class="form-group">
                                    <label for="phone">Grupos especificos</label>
                                    <div class="container-group-sms">
                                        <div class="group-sms-item active">
                                            Inscritos no CSU
                                        </div>
                                        <div class="group-sms-item">
                                            Reclamantes
                                        </div>
                                        <div class="group-sms-item">
                                            Coordenadores do CSU
                                        </div>
                                        <div class="group-sms-item">
                                            Seguidores do CSU
                                        </div>
                                    </div>
                                    <small class="feedback-error d-none" data-error-feedback="phone"></small>
                                </div>
                                <div class="form-group">
                                    <label for="sms">Mensagem</label>
                                    <textarea class="form-control" name="sms" rows="13"></textarea>
                                    <small class="feedback-error d-none" data-error-feedback="sms"></small>
                                </div>
                                <div class="container-btns-form">
                                    <button type="button" class="btn btn-send">
                                        Enviar
                                    </button>
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