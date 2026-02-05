import { Request, Response, NextFunction } from "express";
import { handleForm as formHandle } from "../utils/handleForm";
import { getInfoUserLogged } from "../utils/handleJWT";
import { IJWTUserLogged } from "../models/interfaces/IJWTUserLogged";
import { AddContactInfoAlunosForms } from "../models/forms/AddContactInfoAlunosForms";
import { UpdatePasswordAlunosForms } from "../models/forms/UpdatePasswordAlunosForms";
import { Alunos } from "../models/Alunos";
import { Matriculas } from "../models/Matriculas";
import { Notas } from "../models/Notas";
import { Cursos } from "../models/Cursos";
import { Propinas } from "../models/Propinas";

export class UserController {
  static async updateContactInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userLogged = getInfoUserLogged<IJWTUserLogged>(req);
      const uuid = (userLogged?.id ?? "").trim();
      if (!uuid) {
        return res.status(403).json({
          status: 403,
          message: "Acesso Negado Token invalido",
        });
      }

      let formPostData = await formHandle(req);
      let { fields } = formPostData;

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

  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userLogged = getInfoUserLogged<IJWTUserLogged>(req);
      const uuid = (userLogged?.id ?? "").trim();
      if (!uuid) {
        return res.status(403).json({
          status: 403,
          message: "Acesso Negado Token invalido",
        });
      }

      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let passwordForm = new UpdatePasswordAlunosForms(uuid, fields);
      await passwordForm.validateForm();
      let formValidity = passwordForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await passwordForm.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async listMyCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const userLogged = getInfoUserLogged<IJWTUserLogged>(req);
      const uuid = (userLogged?.id ?? "").trim();
      if (!uuid) {
        return res.status(403).json({
          status: 403,
          message: "Acesso Negado Token invalido",
        });
      }

      const alunoList = await Alunos.findByUUID(uuid);
      if (alunoList.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "ID Aluno Invalido",
          errorFeedback: [
            {
              formControll: "uuid",
              feedbackMSG: "ID Aluno Invalido",
            },
          ],
        });
      }

      const alunoInfo: any = alunoList[0];
      const cursosList = await Matriculas.listCursosByAlunoId(Number(alunoInfo.ID));

      return res.status(200).json({
        status: 200,
        message: "Cursos encontrados",
        result: cursosList,
      });
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async listMyNotasPublicadosInCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const userLogged = getInfoUserLogged<IJWTUserLogged>(req);
      const uuid = (userLogged?.id ?? "").trim();
      if (!uuid) {
        return res.status(403).json({
          status: 403,
          message: "Acesso Negado Token invalido",
        });
      }

      const cursoUuidRaw =
        (req?.params as any)?.["cursouuid"] ??
        (req?.params as any)?.curso_uuid ??
        (req?.params as any)?.cursoUuid ??
        "";
      const cursoUuid = (cursoUuidRaw ?? "").toString().trim();

      if (!cursoUuid) {
        return res.status(400).json({
          status: 400,
          message: "ID Curso Invalido",
          errorFeedback: [
            {
              formControll: "curso-uuid",
              feedbackMSG: "Invalido",
            },
          ],
        });
      }

      const alunoList = await Alunos.findByUUID(uuid);
      if (alunoList.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "ID Aluno Invalido",
          errorFeedback: [
            {
              formControll: "uuid",
              feedbackMSG: "ID Aluno Invalido",
            },
          ],
        });
      }

      const cursoList = await Cursos.findByUUID(cursoUuid);
      if (cursoList.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "ID Curso Invalido",
          errorFeedback: [
            {
              formControll: "curso-uuid",
              feedbackMSG: "ID Curso Invalido",
            },
          ],
        });
      }

      const alunoInfo: any = alunoList[0];
      const notasList = await Notas.listNotasPublicadasByAlunoCurso(
        Number(alunoInfo.ID),
        cursoUuid
      );

      return res.status(200).json({
        status: 200,
        message: "Notas encontradas",
        result: notasList,
      });
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async listMyProprinasInCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const userLogged = getInfoUserLogged<IJWTUserLogged>(req);
      const uuid = (userLogged?.id ?? "").trim();
      if (!uuid) {
        return res.status(403).json({
          status: 403,
          message: "Acesso Negado Token invalido",
        });
      }

      const cursoUuidRaw =
        (req?.params as any)?.cursouuid ??
        (req?.params as any)?.["curso-uuid"] ??
        (req?.params as any)?.curso_uuid ??
        (req?.params as any)?.cursoUuid ??
        "";
      const cursoUuid = (cursoUuidRaw ?? "").toString().trim();

      if (!cursoUuid) {
        return res.status(400).json({
          status: 400,
          message: "ID Curso Invalido",
          errorFeedback: [
            {
              formControll: "cursouuid",
              feedbackMSG: "Invalido",
            },
          ],
        });
      }

      const alunoList = await Alunos.findByUUID(uuid);
      if (alunoList.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "ID Aluno Invalido",
          errorFeedback: [
            {
              formControll: "uuid",
              feedbackMSG: "ID Aluno Invalido",
            },
          ],
        });
      }

      const cursoList = await Cursos.findByUUID(cursoUuid);
      if (cursoList.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "ID Curso Invalido",
          errorFeedback: [
            {
              formControll: "cursouuid",
              feedbackMSG: "ID Curso Invalido",
            },
          ],
        });
      }

      const alunoInfo: any = alunoList[0];
      const propinasList = await Propinas.listByAlunoCurso(Number(alunoInfo.ID), cursoUuid);

      return res.status(200).json({
        status: 200,
        message: "Propinas encontradas",
        result: propinasList,
      });
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }
}
