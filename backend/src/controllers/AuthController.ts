import { Request, Response, NextFunction } from "express";
import { handleForm as formHandle } from "../utils/handleForm";
import { LoginAlunosForms } from "../models/forms/LoginAlunosForms";

export class AuthController {
  static async loginAlunos(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let loginForm = new LoginAlunosForms(fields);
      await loginForm.validateForm();
      let formValidity = loginForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await loginForm.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }
}
