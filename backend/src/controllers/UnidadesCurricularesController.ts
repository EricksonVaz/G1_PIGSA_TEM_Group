import { Request, Response, NextFunction } from "express";
import { sequelize } from "../db/sequelize";
import { UnidadesCurriculares } from "../models/UnidadesCurriculares";
import { handleForm as formHandle } from "../utils/handleForm";
import { CreateUnidadesCurricularesForms } from "../models/forms/CreateUnidadesCurricularesForms";

export class UnidadesCurricularesController {
  static async listAll(req: Request, res: Response, next: NextFunction){
    try {
      
      let unidadesCurricularesList = await UnidadesCurriculares.getAll();
      
      return res.status(200).json(
        {
          status:200,
          message:"Unidades Curriculares encontradas",
          result:unidadesCurricularesList
        }
      );
    } catch (error) {
      res.status(500);
      return res.json({status:500,message:"Internal Server Error",error:error});
    }
  }

  static async adicionar(req: Request, res: Response, next: NextFunction) {
    try {
    
      let formPostData = await formHandle(req);
      let {fields,files} = formPostData;
      console.log("fields",fields);
      let ucCreateModel = new CreateUnidadesCurricularesForms(fields);
      await ucCreateModel.validateForm();
      let formValidity = ucCreateModel.checkValidity();

      if(formValidity?.length){
          return res.status(400).json(
              {
                  status:400,
                  message:"Erro no formulário",
                  errorFeedback:formValidity
              }
          )
      }else{
          let postRequestResponse = await ucCreateModel.post();
          let {status} = postRequestResponse;
          return res.status(status).json(
              postRequestResponse
          );
      }
    } catch (error) {
      res.status(500);
      return res.json({status:500,message:"Internal Server Error",error:error});
    }
  }

  static async editar(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let {fields,files} = formPostData;

      let uuid = (req?.params?.id ?? "").trim();

      console.log("fields",fields);
      let ucCreateModel = new CreateUnidadesCurricularesForms(fields);
      await ucCreateModel.validateForm();
      let formValidity = ucCreateModel.checkValidity();

      if(formValidity?.length){
          return res.status(400).json(
              {
                  status:400,
                  message:"Erro no formulário",
                  errorFeedback:formValidity
              }
          )
      }else{
          let postRequestResponse = await ucCreateModel.post();
          let {status} = postRequestResponse;
          return res.status(status).json(
              postRequestResponse
          );
      }
    } catch (error) {
      res.status(500);
      return res.json({status:500,message:"Internal Server Error",error:error});
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction) {
    try {
      
    } catch (error) {
      res.status(500);
      return res.json({status:500,message:"Internal Server Error",error:error});
    }
  }
}
