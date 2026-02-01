import { displayErrorsFeedback, formErrorSpreadObj } from "../../utils/functions/HttpRequest";

export function formSendSMS(){
    return `
        <form class="form-send-sms">
            <div class="form-group">
                <label for="phone">Número de destino</label>
                <input type="number" name="phone" class="form-control" value="">
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
    `;
}

export class ActionsOnFormSendSMS{

    private static _rootElement?:HTMLElement;

    static formSendSMS?:HTMLFormElement;
    static inputPhoneNumber?:HTMLInputElement;
    static inputSMS?:HTMLInputElement;
    private static btnSubmit?:HTMLButtonElement;

    static setRootElement(element:HTMLElement){
        this._rootElement = element;

        this.formSendSMS = this._rootElement.querySelector(".form-send-sms") as HTMLFormElement;

        if(this.formSendSMS){
            this.inputPhoneNumber = this.formSendSMS.querySelector(`[name="phone"]`) as HTMLInputElement;
            this.inputSMS = this.formSendSMS.querySelector(`[name="sms"]`) as HTMLInputElement;
            this.btnSubmit = this.formSendSMS.querySelector(".btn-send") as HTMLButtonElement;
        }
        return this;
    }

    // static setIdClaimsInForm(idClaims:string){
    //     ActionsOffsideAddCategory.inputIdClaims!.value = idClaims;

    //     ActionsOffsideAddCategory.innerModalCtrl.setIdClaimsInFormAddObsNC(idClaims);
    // }

    // static clearTagContainer(){
    //     this.tagAddedContainer!.innerHTML = "";
    //     //this.formAddCategory?.reset();
    //     ActionsOffsideAddCategory.inputCategory!.value = "";
    // }

    // static onCategoryAdded(){
    //     ActionsOffsideAddCategory.selectCategory?.addEventListener("change",(e)=>{
    //         let tagValueID = +((ActionsOffsideAddCategory.selectCategory?.value ?? "").trim());

    //         if(tagValueID && tagValueID<=5){
    //             let labelOption = (ActionsOffsideAddCategory.selectCategory?.querySelector<HTMLOptionElement>(`[value="${tagValueID}"]`)?.innerText ?? "").trim();


    //             let currentValuesAdd = (ActionsOffsideAddCategory.inputCategory?.value??"");

    //             if(currentValuesAdd==""){
    //                 ActionsOffsideAddCategory.inputCategory!.value = ""+tagValueID;
    //                 ActionsOffsideAddCategory.tagAddedContainer!.innerHTML = tagCategory(labelOption,""+tagValueID);
    //                 ActionsOffsideAddCategory.selectCategory!.selectedIndex = 0;
    //             }else if(currentValuesAdd && currentValuesAdd.indexOf(""+tagValueID)<0){
    //                 ActionsOffsideAddCategory.inputCategory!.value = currentValuesAdd+";"+tagValueID
    //                 ActionsOffsideAddCategory.tagAddedContainer!.innerHTML += tagCategory(labelOption,""+tagValueID);
    //                 ActionsOffsideAddCategory.selectCategory!.selectedIndex = 0;
    //             }
    //         }
    //     });
    // }

    // static onCategoryDeleted(){
    //     ActionsOffsideAddCategory.tagAddedContainer?.addEventListener("click",(e)=>{
    //         let elementClicked = e.target as HTMLElement;

    //         if(elementClicked.classList.contains("btn-del-tag")){
    //             let parenteElement = elementClicked.parentElement as HTMLElement;
    //             let idCategory = (parenteElement.dataset?.idCat ?? "").trim();

    //             let currentValuesAdd = (ActionsOffsideAddCategory.inputCategory?.value ?? "")
    //             .trim()
    //             .split(";")
    //             .filter(el=>el!=idCategory);

    //             ActionsOffsideAddCategory.inputCategory!.value = currentValuesAdd.join(";");
    //             parenteElement.remove();

    //         }
    //     });
    // }

    static onSubmitForm(
        callback:(formData:FormData,formElement:HTMLFormElement)=>void
    ){
        this.btnSubmit?.addEventListener("click",()=>{
            let formData = new FormData(ActionsOnFormSendSMS.formSendSMS!);

            let [objError,inputsNameArr] = ActionsOnFormSendSMS.validateForm(formData);

            console.log(objError,inputsNameArr)

            if(inputsNameArr.length){
                ActionsOnFormSendSMS.formSendSMS?.querySelectorAll(`[data-error-feedback]`).
                forEach(el=>{
                    el.classList.add("d-none");
                })
                displayErrorsFeedback(objError,ActionsOnFormSendSMS.formSendSMS!);

            }else{
                callback(
                    formData,
                    ActionsOnFormSendSMS.formSendSMS!
                );
            }
        });
    }

    private static validateForm(formData:FormData):[formErrorSpreadObj,string[]]{
        let formErrorFeedBack:formErrorSpreadObj = {};

        let sms = (formData.get("sms") as string)?.trim() ?? "";
        let phone = ((formData.get("phone") as string)?.trim() ?? "qqq");

        if(!phone || (phone).toLowerCase() == "qqq"){
            formErrorFeedBack["phone"] = "Campo obrigatório";
        }else if(isNaN(+phone) || (+phone<5000000 || +phone>9999999)){
            formErrorFeedBack["phone"] = "Numero de telefone invalido";
        }

        if(!sms){
            formErrorFeedBack["sms"] = "Campo obrigatório";
        }else if(sms.length>160){
            formErrorFeedBack["sms"] = "São permitidos apaenas 160 caracteres por sms";
        }

        return [formErrorFeedBack,Object.keys(formErrorFeedBack)];
    }
}