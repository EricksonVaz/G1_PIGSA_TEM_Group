import { Request, Response, NextFunction } from "express";
import { handleForm as formHandle } from "../utils/handleForm";
import { ListarNotasMatriculasForm } from "../models/forms/ListarNotasMatriculasForm";
import { PublicarNotaForm } from "../models/forms/PublicarNotaForm";
import { RemoveNotaForm } from "../models/forms/RemoveNotaForm";

export class NotasController {
  static async listarAlunos(req: Request, res: Response, next: NextFunction) {
    try {
      const filtro = (req?.params?.filterCursos ?? "").toString().trim();
      const listForm = new ListarNotasMatriculasForm(filtro);
      const response = await listForm.post();
      return res.status(response.status).json(response);
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async registar(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let notaForm = new PublicarNotaForm(fields);
      await notaForm.validateForm();
      let formValidity = notaForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await notaForm.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async apagarNota(req: Request, res: Response, next: NextFunction) {
    try {
      let removeForm = new RemoveNotaForm(req.params ?? {});
      await removeForm.validateForm();
      let formValidity = removeForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "ID Nota invalido",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await removeForm.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }
}
