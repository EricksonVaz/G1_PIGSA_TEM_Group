import { displayErrorsFeedback, formErrorSpreadObj } from "../../utils/functions/HttpRequest";

export function formSendBulkSMS(){
    return `
        <form class="form-send-sms">
            <div class="form-group">
                <div class="input-group">
                    <input type="number" class="form-control input-add-number" value="">
                    <button type="button" class="btn btn-add-number">
                        Adicionar número
                    </button>
                </div>
                <input type="hidden" value="" name="phone">
                <small class="feedback-error d-none" data-error-feedback="phone2"></small>
                <label for="phone">Números Adicionados</label>
                <div class="number-added-container">
                    
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
    `;
}

export class ActionsOnFormSendBulkSMS{

    private static _rootElement?:HTMLElement;

    static formSendSMS?:HTMLFormElement;
    static inputAddNumber?:HTMLInputElement;
    static inputPhoneNumber?:HTMLInputElement;
    static numberAddedContainer?:HTMLDivElement;
    static inputSMS?:HTMLInputElement;
    private static btnAddNumber?:HTMLButtonElement;
    private static btnSubmit?:HTMLButtonElement;

    static setRootElement(element:HTMLElement){
        this._rootElement = element;

        this.formSendSMS = this._rootElement.querySelector(".form-send-sms") as HTMLFormElement;

        if(this.formSendSMS){
            this.inputAddNumber = this.formSendSMS.querySelector(`.input-add-number`) as HTMLInputElement;
            this.inputPhoneNumber = this.formSendSMS.querySelector(`[name="phone"]`) as HTMLInputElement;
            this.inputSMS = this.formSendSMS.querySelector(`[name="sms"]`) as HTMLInputElement;
            this.btnAddNumber = this.formSendSMS.querySelector(".btn-add-number") as HTMLButtonElement;
            this.btnSubmit = this.formSendSMS.querySelector(".btn-send") as HTMLButtonElement;
            this.numberAddedContainer = this.formSendSMS.querySelector(".number-added-container") as HTMLDivElement;
        }
        return this;
    }

    static addAndRemoveNumberActions(){
        this.btnAddNumber?.addEventListener("click",()=>{
            let formErrorFeedBack:formErrorSpreadObj = {};
            let numbertoAdd = (this.inputAddNumber?.value??"qqq").trim();

            if(!numbertoAdd || (numbertoAdd).toLowerCase() == "qqq"){
                formErrorFeedBack["phone2"] = "Campo obrigatório";
                displayErrorsFeedback(formErrorFeedBack,ActionsOnFormSendBulkSMS.formSendSMS!);
            }else if(isNaN(+numbertoAdd) || (+numbertoAdd<5000000 || +numbertoAdd>9999999)){
                formErrorFeedBack["phone2"] = "Número de telefone invalido";
                displayErrorsFeedback(formErrorFeedBack,ActionsOnFormSendBulkSMS.formSendSMS!);
            }else{
                let numbersAlreadyAdded:string[] = [];

                if(this.inputPhoneNumber?.value.trim()){
                    numbersAlreadyAdded = (this.inputPhoneNumber?.value??"").split(";");
                }

                if(numbersAlreadyAdded.includes(numbertoAdd)){
                    formErrorFeedBack["phone2"] = "Este número já foi adicionado";
                    displayErrorsFeedback(formErrorFeedBack,ActionsOnFormSendBulkSMS.formSendSMS!);
                }else{
                    numbersAlreadyAdded.push(numbertoAdd);

                    if(this.inputPhoneNumber)this.inputPhoneNumber.value = numbersAlreadyAdded.join(";");

                    if(this.inputAddNumber)this.inputAddNumber.value = "";

                    if(this.numberAddedContainer){
                        this.numberAddedContainer.innerHTML = "";

                        this.numberAddedContainer.innerHTML = numbersAlreadyAdded.map(number=>`
                            <div class="number-item">
                                <span class="label-number">
                                    ${number}
                                </span>
                                <div class="del-number">
                                    &times;
                                </div>
                            </div>
                        `).join("");
                    }
                }
            }
        });

        this.numberAddedContainer?.addEventListener("click",(e)=>{
            let elementClicked = e.target as HTMLElement;

            if(elementClicked.classList.contains("del-number")){
                let previousElement = (elementClicked.previousElementSibling as HTMLSpanElement);

                let currentNumber = "";

                if(previousElement)currentNumber = previousElement.innerText.trim();

                let numbersAlreadyAdded = (this.inputPhoneNumber?.value??"").split(";");

                numbersAlreadyAdded = numbersAlreadyAdded.filter(number=>number!=currentNumber);

                if(this.inputPhoneNumber)this.inputPhoneNumber.value = numbersAlreadyAdded.join(";");

                if(this.numberAddedContainer){
                    this.numberAddedContainer.innerHTML = "";

                    this.numberAddedContainer.innerHTML = numbersAlreadyAdded.map(number=>`
                        <div class="number-item">
                            <span class="label-number">
                                ${number}
                            </span>
                            <div class="del-number">
                                &times;
                            </div>
                        </div>
                    `).join("");
                }
            }
        })
    }

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
            let formData = new FormData(ActionsOnFormSendBulkSMS.formSendSMS!);

            let [objError,inputsNameArr] = ActionsOnFormSendBulkSMS.validateForm(formData);

            console.log(objError,inputsNameArr)

            if(inputsNameArr.length){
                ActionsOnFormSendBulkSMS.formSendSMS?.querySelectorAll(`[data-error-feedback]`).
                forEach(el=>{
                    el.classList.add("d-none");
                })
                displayErrorsFeedback(objError,ActionsOnFormSendBulkSMS.formSendSMS!);

            }else{
                callback(
                    formData,
                    ActionsOnFormSendBulkSMS.formSendSMS!
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
        }else {
            let arrPhone = phone.split(";")

            for (const phoneNumbr of arrPhone) {
                if(isNaN(+phoneNumbr) || (+phoneNumbr<5000000 || +phoneNumbr>9999999)){
                    formErrorFeedBack["phone"] = `O numero de telefone ${phoneNumbr} é invalido`;
                    break;
                }   
            }
        }

        if(!sms){
            formErrorFeedBack["sms"] = "Campo obrigatório";
        }else if(sms.length>160){
            formErrorFeedBack["sms"] = "São permitidos apaenas 160 caracteres por sms";
        }

        return [formErrorFeedBack,Object.keys(formErrorFeedBack)];
    }
}