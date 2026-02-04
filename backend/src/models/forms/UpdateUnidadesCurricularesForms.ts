import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { UnidadesCurriculares } from "../UnidadesCurriculares";

export class UpdateUnidadesCurricularesForms {
    private uuid:string = "";
    private nome_curriculares:string = "";
    private faculdade:string = "";

    private formErrorFeedBack?:IFormErrorFeedback[];

    constructor(uuid:string,fields:Fields){
        if("nome_curriculares" in fields && "faculdade" in fields){
            this.nome_curriculares = ((fields?.nome_curriculares as unknown) as string)?.trim() ?? "";
            this.faculdade = ((fields?.faculdade as unknown) as string)?.trim() ?? "";
            this.uuid = uuid;
            this.validateForm();
        }else{
            this.formErrorFeedBack = [
                {
                    formControll:"nome_curriculares",
                    feedbackMSG:"dados submetidos invalidos"
                }
            ];
        }
        
    }

    checkValidity(){
        return this.formErrorFeedBack;
    }

    validateForm(){
        this.formErrorFeedBack = [];

        if(!this.nome_curriculares){
            this.formErrorFeedBack.push({
                formControll:"nome_curriculares",
                feedbackMSG:"campo obrigatorio"
            });
        }

        if(!this.faculdade){
            this.formErrorFeedBack.push({
                formControll:"faculdade",
                feedbackMSG:"campo obrigatorio"
            });
        }

    }

    async post(){
        let ucExist = await UnidadesCurriculares.findByUUID(this.uuid);
        if(ucExist.length<=0){
            return {
                status:400,
                message:"ID Unidade Curricular Inválida",
                errorFeedback:[
                    {
                        formControll:"nome_curriculares",
                        feedbackMSG:"ID Unidade Curricular Inválida"
                    }
                ]
            }
        }

        let checkUCExist = await UnidadesCurriculares.existeOtherUCWithSameInfo(this.uuid,this.nome_curriculares,this.faculdade);
        if(checkUCExist){
            return {
                status:400,
                message:"já existe uma unidade curricular criada com mesmo nome na mesma faculdade",
                errorFeedback:[
                    {
                        formControll:"nome_curriculares",
                        feedbackMSG:"já existe uma unidade curricular criada com mesmo nome na mesma faculdade"
                    }
                ]
            }
        }

        let ucCreated = await UnidadesCurriculares.updateUC({
            UUID:this.uuid,
            Nome:this.nome_curriculares,
            Faculdade:this.faculdade
        });

        if(ucCreated){
            
            return {
                status:200,
                message:"Unidade curricular atualizada com sucesso",
            }
        }

        return {
            status:500,
            message:"Internal Server Error",
            error:new Error("Não foi possivel atualizar a unidade curricular")
        }
    }
}