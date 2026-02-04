import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Notas } from "../Notas";

export class RemoveNotaForm {
  private idNota: number = 0;
  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(fields: Record<string, any>) {
    if (fields && typeof fields === "object") {
      const idNotaRaw = fields["idNota"];
      this.idNota = Number((idNotaRaw ?? "").toString().trim());
      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "idNota",
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

    if (!this.idNota || Number.isNaN(this.idNota) || this.idNota <= 0) {
      this.formErrorFeedBack.push({
        formControll: "idNota",
        feedbackMSG: "Invalido",
      });
    }
  }

  async post() {
    let deletedCount = await Notas.deleteById(this.idNota);

    if (deletedCount && deletedCount > 0) {
      return {
        status: 200,
        message: "Nota removida com sucesso",
      };
    }

    return {
      status: 400,
      message: "Nota nao encontrada",
      errorFeedback: [
        {
          formControll: "idNota",
          feedbackMSG: "Nota nao encontrada",
        },
      ],
    };
  }
}
