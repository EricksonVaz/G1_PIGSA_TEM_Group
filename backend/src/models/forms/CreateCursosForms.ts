import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Cursos } from "../Cursos";

const VALID_GRAUS = ["licenciatura", "mestrado", "doutorado"];

export class CreateCursosForms {
  private nomeCurso: string = "";
  private grauCurso: string = "";
  private semestresCurso: number = 0;
  private faculdadeCurso: string = "";

  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(fields: Fields) {
    if ("nome-curso" in fields && "grau-curso" in fields && "semestres-curso" in fields && "faculdade-curso" in fields) {
      this.nomeCurso = ((fields["nome-curso"] as unknown) as string)?.trim() ?? "";
      this.grauCurso = ((fields["grau-curso"] as unknown) as string)?.trim().toLowerCase() ?? "";
      this.semestresCurso = Number(((fields["semestres-curso"] as unknown) as string)?.trim() ?? "0");
      this.faculdadeCurso = ((fields["faculdade-curso"] as unknown) as string)?.trim() ?? "";
      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "nome-curso",
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

    if (!this.nomeCurso) {
      this.formErrorFeedBack.push({
        formControll: "nome-curso",
        feedbackMSG: "campo obrigatorio",
      });
    }

    if (!this.grauCurso || !VALID_GRAUS.includes(this.grauCurso)) {
      this.formErrorFeedBack.push({
        formControll: "grau-curso",
        feedbackMSG: "campo invalido",
      });
    }

    if (!this.semestresCurso || this.semestresCurso <= 0) {
      this.formErrorFeedBack.push({
        formControll: "semestres-curso",
        feedbackMSG: "campo obrigatorio",
      });
    }

    if (!this.faculdadeCurso) {
      this.formErrorFeedBack.push({
        formControll: "faculdade-curso",
        feedbackMSG: "campo obrigatorio",
      });
    }
  }

  async post() {
    let cursoExist = await Cursos.findByNomeGrauSemestre(
      this.nomeCurso,
      this.grauCurso,
      this.faculdadeCurso,
      this.semestresCurso
    );

    if (cursoExist.length) {
      return {
        status: 400,
        message: "ja existe um curso criado com mesmo nome, grau e semestre",
        errorFeedback: [
          {
            formControll: "nome-curso",
            feedbackMSG: "ja existe um curso criado com mesmo nome, grau e semestre",
          },
        ],
      };
    }

    let cursoCreated = await Cursos.createNew({
      Nome: this.nomeCurso,
      Grau: this.grauCurso,
      Faculdade: this.faculdadeCurso,
      Semestre: this.semestresCurso,
    });

    if (typeof cursoCreated == "object" && ("ID" in cursoCreated)) {
      return {
        status: 201,
        message: "Curso criado com sucesso",
        result: [cursoCreated],
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
      error: new Error("Nao foi possivel criar o curso"),
    };
  }
}
