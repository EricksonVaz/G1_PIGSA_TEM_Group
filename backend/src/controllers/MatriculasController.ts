import { Request, Response, NextFunction } from "express";
import { MatriculaAlunosSemestreForm } from "../models/forms/MatriculaAlunosSemestreForm";
import { RemoveMatriculaAlunosSemestreForm } from "../models/forms/RemoveMatriculaAlunosSemestreForm";
import { handleForm as formHandle } from "../utils/handleForm";

export class MatriculasController {
  static async addAlunosSemestre(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let matriculaForm = new MatriculaAlunosSemestreForm(fields);
      await matriculaForm.validateForm();
      let formValidity = matriculaForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await matriculaForm.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async removeAlunosSemestre(req: Request, res: Response, next: NextFunction) {
    try {
      let removeMatriculaForm = new RemoveMatriculaAlunosSemestreForm(req.params ?? {});
      await removeMatriculaForm.validateForm();
      let formValidity = removeMatriculaForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "ID Matricula invalido",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await removeMatriculaForm.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }
}
