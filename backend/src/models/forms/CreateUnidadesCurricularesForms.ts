import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { UnidadesCurriculares } from "../UnidadesCurriculares";

export class CreateUnidadesCurricularesForms {
    private nome_curriculares:string = "";
    private faculdade:string = "";

    private formErrorFeedBack?:IFormErrorFeedback[];

    constructor(fields:Fields){
        if("nome_curriculares" in fields && "faculdade" in fields){
            this.nome_curriculares = ((fields?.nome_curriculares as unknown) as string)?.trim() ?? "";
            this.faculdade = ((fields?.faculdade as unknown) as string)?.trim() ?? "";
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
        let ucExist = await UnidadesCurriculares.findByNomeAndFaculdade(this.nome_curriculares,this.faculdade);
        if(ucExist.length){
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

        let ucCreated = await UnidadesCurriculares.createNew({
            Nome:this.nome_curriculares,
            Faculdade:this.faculdade
        });

        if(typeof ucCreated=="object" && ("ID" in ucCreated)){
            
            return {
                status:200,
                message:"Unidade curricular criada com sucesso",
                result:[ucCreated]
            }
        }

        return {
            status:500,
            message:"Internal Server Error",
            error:new Error("Não foi possivel criar este novo beneficio")
        }
    }
}