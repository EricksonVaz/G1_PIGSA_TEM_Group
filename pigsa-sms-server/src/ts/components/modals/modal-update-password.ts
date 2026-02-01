import { displayErrorsFeedback } from "../../utils/functions/HttpRequest";
import { TLoaderInContainer, loaderInContainer } from "../../utils/functions/loaderInContainer";

export let modalUpdatePassword = `
    <div class="modal modal-update-pass" id="modal-update-pass">
        <div class="modal-header">
            <h2 class="modal-title">
                Alterar password
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
            <form class="form form-my-pass">
                <div class="form-group">
                    <label for="myoldpass" class="required">Password antigo</label>
                    <input type="password" class="form-control" name="oldpassword" id="myoldpass" required>
                    <small class="feedback-error d-none" data-error-feedback="oldpassword"></small>
                </div>
                <div class="row">
                    <div class="form-group">
                        <label for="mynewpass" class="required">Novo password</label>
                        <input type="password" class="form-control" name="newpassword" id="mynewpass" required>
                        <small class="feedback-error d-none" data-error-feedback="newpassword"></small>
                    </div>
                    <div class="form-group">
                        <label for="myconfirm" class="required">Confirmar password</label>
                        <input type="password" class="form-control" name="confirm" id="myconfirm" required>
                        <small class="feedback-error d-none" data-error-feedback="confirm"></small>
                    </div>
                </div>
                <div class="btns-group">
                    <button type="submit" class="btn-submit">Guardar</button>
                </div>
            </form>
        </div>
    </div>
`;

export class ActionsModalUpdatePassword{

    private static _rootElement?:HTMLElement;

    static formUpdatePassword?:HTMLFormElement;
    static inputOldPassword?:HTMLInputElement;
    static inputNewPassword?:HTMLInputElement;
    static inputConfirmPassword?:HTMLInputElement;

    static setRootElement(element:HTMLElement){
        this._rootElement = element;

        this.formUpdatePassword = this._rootElement.querySelector(".form-my-pass") as HTMLFormElement;

        if(this.formUpdatePassword){
            this.inputOldPassword = this.formUpdatePassword.querySelector(`[name="oldpassword"]`) as HTMLInputElement;
            this.inputNewPassword = this.formUpdatePassword.querySelector(`[name="newpassword"]`) as HTMLInputElement;
            this.inputConfirmPassword = this.formUpdatePassword.querySelector(`[name="confirm"]`) as HTMLInputElement;
        }
        return this;
    }

    static addEventSubmitForm(
        callback:(
            formData:FormData,
            loaderInOffside?:TLoaderInContainer,
            formElement?:HTMLFormElement
        )=>void|undefined
    ){
        ActionsModalUpdatePassword.formUpdatePassword?.addEventListener("submit",(e)=>{
            e.preventDefault();

            let oldPassword = (ActionsModalUpdatePassword.inputOldPassword?.value ?? "").trim();
            let newPassword = (ActionsModalUpdatePassword.inputNewPassword?.value ?? "").trim();
            let confirmPassword = (ActionsModalUpdatePassword.inputConfirmPassword?.value ?? "").trim();

            let formIsOkay = true;

            if(!oldPassword){
                displayErrorsFeedback({
                    oldpassword:"Campo obrigatório"
                },ActionsModalUpdatePassword.formUpdatePassword);

                formIsOkay = false;
            }

            if(newPassword.length<6){
                displayErrorsFeedback({
                    newpassword:"Deve ter no minimo 6 caracteres"
                },ActionsModalUpdatePassword.formUpdatePassword);

                formIsOkay = false;
            }else{
                if(!confirmPassword){
                    displayErrorsFeedback({
                        confirm:"Campo obrigatório"
                    },ActionsModalUpdatePassword.formUpdatePassword)
                    formIsOkay = false;
                }else if(confirmPassword!=newPassword){
                    displayErrorsFeedback({
                        confirm:"Password não coecidem"
                    },ActionsModalUpdatePassword.formUpdatePassword)

                    formIsOkay = false;
                }
            }

            if(formIsOkay){
                let formData = new FormData(ActionsModalUpdatePassword.formUpdatePassword);

                let loaderInModal = loaderInContainer(".modal-update-pass .loader");

                loaderInModal?.show();

                if(callback)callback(formData,loaderInModal,ActionsModalUpdatePassword.formUpdatePassword);
            }
        });
    }
}