export let modalUpdateRecords = `
    <div class="modal modal-update-records" id="modal-update-records">
        <div class="modal-header">
            <h2 class="modal-title">
                Corrigir registos
            </h2>
            <span class="close-modal">
                &times;
            </span>
        </div>
        <div class="modal-body">
            <div class="loader d-none">
                <div class="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div class="card-member-info">
                <div class="label-inline">
                    <span class="label-title">
                        NIA :
                    </span>
                    <span class="label-content">
                        03.181210.161403
                    </span>
                </div>
                <div class="label-container">
                    <div class="label-inline">
                        <span class="label-title">
                            Erickson de Carvalho Vaz
                        </span>
                    </div>
                    <div class="label-inline">
                        <span class="label-title">
                            03.181210.161403
                        </span>
                    </div>
                </div>
                <div class="label-container">
                    <div class="label-inline">
                        <span class="label-title">
                            Zona :
                        </span>
                        <span class="label-content">
                            Ponta d'Água
                        </span>
                    </div>
                    <div class="label-inline">
                        <span class="label-title">
                            Contacto :
                        </span>
                        <span class="label-content">
                            5911626
                        </span>
                    </div>
                </div>
            </div>
            <div class="update-info-container" data-tab-id="update">
                <small class="feedback-error d-none" data-error-feedback="update-records"></small>
                <div class="container-update">
                    <button class="btn btn-request-delete d-none">
                        Solicitar Eliminação
                    </button>
                    <div class="container-old-data">
                        <div class="inline-control">
                            <div class="form-group">
                                <label>Tipo</label>
                                <select class="form-control select-doctype-readonly" disabled>
                                    <option value="" disabled selected>
                                        Tipo
                                    </option>
                                    <option value="BI">
                                        BI
                                    </option>
                                    <option value="CNI">
                                        CNI
                                    </option>
                                    <option value="Cartao de Residencia">
                                        Cartão de Residência
                                    </option>
                                    <option value="Passaporte">
                                        Passaporte
                                    </option>
                                    <option value="Certidao de Nascimento">
                                        Certidão de Nascimento
                                    </option>
                                    <option value="Cedula de Nascimento">
                                        Cedula de Nascimento
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Código do Documento Registado</label>
                                <input class="form-control input-docid-readonly" type="text" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="container-new-data">
                        <div class="inline-control">
                            <div class="form-group">
                                <label for="level">Tipo</label>
                                <select class="form-control select-doctype">
                                    <option value="" disabled selected>
                                        Tipo
                                    </option>
                                    <option value="0">
                                        Manter
                                    </option>
                                    <option value="1">
                                        BI
                                    </option>
                                    <option value="2">
                                        CNI
                                    </option>
                                    <option value="3">
                                        Cartão de Residência
                                    </option>
                                    <option value="4">
                                        Passaporte
                                    </option>
                                    <option value="5">
                                        Certidão de Nascimento
                                    </option>
                                    <option value="6">
                                        Cedula de Nascimento
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="email">Novo Código do Documento</label>
                                <input class="form-control input-docid" type="text">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container-request-done d-none">
                    <div class="label-text">
                        Para este registo fizeste uma solicitação de eliminação
                    </div>
                    <div class="buttons-options">
                        <button class="btn btn-view-request">
                            Vizualizar Solicitação
                        </button>
                        <button class="btn btn-remove-request">
                            Remover Solicitação
                        </button>
                    </div>
                </div>
                <div class="navigation-progress">
                    <div class="total-records-container">
                        
                    </div>
                    <div class="btn-nav-container">
                        <button class="btn btn-nav-prev">
                            anterior
                        </button>
                        <button class="btn btn-nav-next">
                            Próximo
                        </button>
                        <button class="btn btn-save-updates">
                            Finalizar e Guardar
                        </button>
                    </div>
                </div>
            </div>
            <div class="request-delete-container d-none" data-tab-id="delete">
                <div class="form-request-delete">
                    <div class="form-group">
                        <label for="level">Solicitar eliminação do?</label>
                        <select class="form-control select-type-delete" name="tipo-delete">
                            <option value="" disabled selected>
                                selecione um
                            </option>
                            <option value="member">
                                Membro
                            </option>
                            <option value="agg">
                                Agregado
                            </option>
                        </select>
                        <small class="feedback-error d-none" data-error-feedback="tipo-delete"></small>
                    </div>
                    <div class="form-group">
                        <label for="email">Motivo</label>
                        <textarea class="form-control textarea-motivo" name="motivo" cols="30" rows="7"></textarea>
                        <small class="feedback-error d-none" data-error-feedback="motivo"></small>
                    </div>
                    <div class="btn-groups">
                        <button class="btn btn-cancel-delete">
                            Voltar
                        </button>
                        <button class="btn btn-delete-now">
                            Solicitar Eliminação
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;