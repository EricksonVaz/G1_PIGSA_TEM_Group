import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";

function getFieldValue(fields: Fields, keys: string[]) {
  for (const key of keys) {
    if (key in fields) {
      return ((fields[key] as unknown) as string)?.trim() ?? "";
    }
  }
  return "";
}

export class AddDisciplinasCursosForms {
  private uuidUc: string = "";
  private semestre: number = 0;

  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(fields: Fields) {
    this.uuidUc = getFieldValue(fields, [
      "uuid-uc",
      "uuid_uc",
      "uc_uuid",
      "id-uc",
      "id_uc",
    ]);
    let semestreValue = getFieldValue(fields, ["semestre", "semestre-uc", "semestre-disciplina"]);
    this.semestre = Number(semestreValue ?? "0");
    this.validateForm();
  }

  checkValidity() {
    return this.formErrorFeedBack;
  }

  validateForm() {
    this.formErrorFeedBack = [];

    if (!this.uuidUc) {
      this.formErrorFeedBack.push({
        formControll: "uuid-uc",
        feedbackMSG: "campo obrigatorio",
      });
    }

    if (!this.semestre || this.semestre <= 0) {
      this.formErrorFeedBack.push({
        formControll: "semestre",
        feedbackMSG: "campo obrigatorio",
      });
    }
  }

  getData() {
    return {
      uuidUc: this.uuidUc,
      semestre: this.semestre,
    };
  }
}
