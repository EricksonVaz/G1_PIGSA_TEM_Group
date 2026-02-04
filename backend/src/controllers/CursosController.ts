import { Request, Response, NextFunction } from "express";
import { Cursos } from "../models/Cursos";
import { UnidadesCurriculares } from "../models/UnidadesCurriculares";
import { Disciplinas } from "../models/Disciplinas";
import { handleForm as formHandle } from "../utils/handleForm";
import { CreateCursosForms } from "../models/forms/CreateCursosForms";
import { UpdateCursosForms } from "../models/forms/UpdateCursosForms";
import { AddDisciplinasCursosForms } from "../models/forms/AddDisciplinasCursosForms";
import { RemoveDisciplinasCursosForms } from "../models/forms/RemoveDisciplinasCursosForms";
import { IResponseJSON } from "../models/interfaces/IResponseJSON";

export class CursosController {
  static async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      let cursosList = await Cursos.getAll();

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

  static async adicionar(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let cursoCreateModel = new CreateCursosForms(fields);
      await cursoCreateModel.validateForm();
      let formValidity = cursoCreateModel.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await cursoCreateModel.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async editar(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let uuid = (req?.params?.uuid ?? "").trim();

      let cursoUpdateModel = new UpdateCursosForms(uuid, fields);
      await cursoUpdateModel.validateForm();
      let formValidity = cursoUpdateModel.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      } else {
        let postRequestResponse = await cursoUpdateModel.post();
        let { status } = postRequestResponse;
        return res.status(status).json(postRequestResponse);
      }
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction) {
    try {
      let uuid = (req?.params?.uuid ?? "").trim();

      let responseDeleteCurso = await Cursos.deleteCurso(uuid);
      let responseJSON: IResponseJSON | undefined;

      if (typeof responseDeleteCurso == "string") {
        responseJSON = {
          status: 400,
          message: "ID Curso Invalido",
          errorFeedback: [
            {
              formControll: "ID Curso",
              feedbackMSG: "Invalido",
            },
          ],
        };
      } else if (typeof responseDeleteCurso == "number" && responseDeleteCurso > 0) {
        responseJSON = {
          status: 200,
          message: "Curso eliminado com sucesso",
        };
      } else {
        responseJSON = {
          status: 500,
          message: "Internal Server Error",
          error: new Error("Nao foi possivel atualizar o curso"),
        };
      }

      let { status } = responseJSON;
      return res.status(status).json(responseJSON);
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  // Inserido na tabela disciplinas, Relacao muito para muitos Cursos-Unidades_Curriculares representados na tabela disciplinas
  static async adicionarUCEmCursos(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let uuid = (req?.params?.uuid ?? "").trim();
      let addDisciplinaForm = new AddDisciplinasCursosForms(fields);
      let formValidity = addDisciplinaForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      }

      let { uuidUc, semestre } = addDisciplinaForm.getData();

      let cursoList = await Cursos.findInternalByUUID(uuid);
      if (cursoList.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "ID Curso Invalido",
          errorFeedback: [
            {
              formControll: "ID Curso",
              feedbackMSG: "Invalido",
            },
          ],
        });
      }

      let ucList = await UnidadesCurriculares.findInternalByUUID(uuidUc);
      if (ucList.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "ID Unidade Curricular Invalida",
          errorFeedback: [
            {
              formControll: "uuid-uc",
              feedbackMSG: "Unidade Curricular Invalida",
            },
          ],
        });
      }

      let cursoInfo = cursoList[0] as any;
      if (cursoInfo?.Semestre && semestre > Number(cursoInfo.Semestre)) {
        return res.status(400).json({
          status: 400,
          message: "Semestre invalido para o curso",
          errorFeedback: [
            {
              formControll: "semestre",
              feedbackMSG: "Semestre invalido para o curso",
            },
          ],
        });
      }

      let disciplinaExist = await Disciplinas.findByCursoAndUC(
        Number(cursoInfo.ID),
        Number(ucList[0].ID)
      );
      if (disciplinaExist.length) {
        return res.status(400).json({
          status: 400,
          message: "Unidade curricular ja adicionada ao curso",
          errorFeedback: [
            {
              formControll: "uuid-uc",
              feedbackMSG: "Unidade curricular ja adicionada ao curso",
            },
          ],
        });
      }

      let disciplinaCreated = await Disciplinas.createNew({
        ID_Curso: Number(cursoInfo.ID),
        ID_UC: Number(ucList[0].ID),
        Semestre: Number(semestre),
      });

      if (typeof disciplinaCreated == "object" && ("ID" in disciplinaCreated)) {
        return res.status(201).json({
          status: 201,
          message: "Disciplina adicionada com sucesso",
          result: [disciplinaCreated],
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: new Error("Nao foi possivel adicionar a disciplina no curso"),
      });
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }

  // Hard Delete na tabela disciplinas, Relacao muito para muitos Cursos-Unidades_Curriculares
  static async removerUCEmCursos(req: Request, res: Response, next: NextFunction) {
    try {
      let formPostData = await formHandle(req);
      let { fields } = formPostData;

      let uuid = (req?.params?.uuid ?? "").trim();
      let removeDisciplinaForm = new RemoveDisciplinasCursosForms(fields);
      let formValidity = removeDisciplinaForm.checkValidity();

      if (formValidity?.length) {
        return res.status(400).json({
          status: 400,
          message: "Erro no formulario",
          errorFeedback: formValidity,
        });
      }

      let { uuidUc, semestre } = removeDisciplinaForm.getData();

      let cursoList = await Cursos.findInternalByUUID(uuid);
      if (cursoList.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "ID Curso Invalido",
          errorFeedback: [
            {
              formControll: "ID Curso",
              feedbackMSG: "Invalido",
            },
          ],
        });
      }

      let ucList = await UnidadesCurriculares.findInternalByUUID(uuidUc);
      if (ucList.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "ID Unidade Curricular Invalida",
          errorFeedback: [
            {
              formControll: "uuid-uc",
              feedbackMSG: "Unidade Curricular Invalida",
            },
          ],
        });
      }

      let cursoInfo = cursoList[0] as any;
      let deletedCount = await Disciplinas.deleteByCursoAndUC(
        Number(cursoInfo.ID),
        Number(ucList[0].ID),
        semestre
      );

      if (deletedCount && deletedCount > 0) {
        return res.status(200).json({
          status: 200,
          message: "Disciplina removida com sucesso",
        });
      }

      return res.status(400).json({
        status: 400,
        message: "Disciplina nao encontrada",
        errorFeedback: [
          {
            formControll: "uuid-uc",
            feedbackMSG: "Disciplina nao encontrada",
          },
        ],
      });
    } catch (error) {
      res.status(500);
      return res.json({ status: 500, message: "Internal Server Error", error: error });
    }
  }
}
