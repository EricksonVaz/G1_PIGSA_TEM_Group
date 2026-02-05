import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Matriculas } from "../Matriculas";
import { Propinas } from "../Propinas";

export class RemoveMatriculaAlunosSemestreForm {
  private idMatricula: number = 0;
  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(fields: Record<string, any>) {
    if (fields && typeof fields === "object") {
      const idMatriculaRaw = fields["idMatricula"];
      this.idMatricula = Number((idMatriculaRaw ?? "").toString().trim());
      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "idMatricula",
          feedbackMSG: "dados submetidos invalidos",
        },
      ];
    }
  }

  checkValidity() {
    return this.formErrorFeedBack;
  }

  validateForm() {
    this.formErrorFeedBack = [];

    if (!this.idMatricula || Number.isNaN(this.idMatricula) || this.idMatricula <= 0) {
      this.formErrorFeedBack.push({
        formControll: "idMatricula",
        feedbackMSG: "Invalido",
      });
    }
  }

  async post() {
    let deletedCount = await Matriculas.softDeleteById(this.idMatricula);

    if (deletedCount && deletedCount > 0) {
      await Propinas.softDeleteByMatriculaId(this.idMatricula);
      return {
        status: 200,
        message: "Matricula removida com sucesso",
      };
    }

    return {
      status: 400,
      message: "Matricula nao encontrada",
      errorFeedback: [
        {
          formControll: "idMatricula",
          feedbackMSG: "Matricula nao encontrada",
        },
      ],
    };
  }
}
