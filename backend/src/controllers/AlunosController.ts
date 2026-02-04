import { Request, Response, NextFunction } from "express";
import { handleForm as formHandle } from "../utils/handleForm";
import { RegisterAlunosInfoForms } from "../models/forms/RegisterAlunosInfoForms";
import { CreateAccessAlunosForms } from "../models/forms/CreateAccessAlunosForms";
import { AddContactInfoAlunosForms } from "../models/forms/AddContactInfoAlunosForms";
import { Alunos } from "../models/Alunos";

export class AlunosController {
  static async registerInfo(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let registerForm = new RegisterAlunosInfoForms(fields);
      await registerForm.validateForm();
      let formValidity = registerForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await registerForm.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async createAccess(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let uuid = (req?.params?.uuid ?? "").trim();

      let accessForm = new CreateAccessAlunosForms(uuid, fields);
      await accessForm.validateForm();
      let formValidity = accessForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await accessForm.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async addContactInfo(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let uuid = (req?.params?.uuid ?? "").trim();

      let contactForm = new AddContactInfoAlunosForms(uuid, fields);
      await contactForm.validateForm();
      let formValidity = contactForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await contactForm.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async removeAluno(req: Request, res: Response, next: NextFunction) {
    try {
      let uuid = (req?.params?.uuid ?? "").trim();

      let responseDeleteAluno = await Alunos.deleteAluno(uuid);

      if (typeof responseDeleteAluno == "string") {
        return res.status(400).json({
          status: 400,
          message: "ID Aluno Invalido",
          errorFeedback: [
            {
              formControll: "ID Aluno",
              feedbackMSG: "Invalido",
            },
          ],
        });
      }

      if (typeof responseDeleteAluno == "number" && responseDeleteAluno > 0) {
        return res.status(200).json({
          status: 200,
          message: "Aluno eliminado com sucesso",
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: new Error("Nao foi possivel eliminar o aluno"),
      });
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async allMatriculados(req: Request, res: Response, next: NextFunction) {
    try {
      let alunosList = await Alunos.getAllMatriculados();

      return res.status(200).json({
        status: 200,
        message: "Alunos encontrados",
        result: alunosList,
      });
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }
}
