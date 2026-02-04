import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Alunos } from "../Alunos";
import { Cursos } from "../Cursos";
import { Matriculas } from "../Matriculas";

export class MatriculaAlunosSemestreForm {
  private uuidCurso: string = "";
  private uuidAluno: string = "";
  private semestre: number = 0;
  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(fields: Fields) {
    if (fields && typeof fields === "object") {
      const uuidCursoRaw = fields["uuidCurso"] ?? fields["uuid-curso"];
      const uuidAlunoRaw = fields["uuidAluno"] ?? fields["uuid-aluno"];
      const semestreRaw = fields["semestre"];

      this.uuidCurso = (uuidCursoRaw ?? "").toString().trim();
      this.uuidAluno = (uuidAlunoRaw ?? "").toString().trim();
      this.semestre = Number((semestreRaw ?? "").toString().trim());
      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "uuid-curso",
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

    if (!this.uuidCurso) {
      this.formErrorFeedBack.push({
        formControll: "uuid-curso",
        feedbackMSG: "campo obrigatorio",
      });
    }

    if (!this.uuidAluno) {
      this.formErrorFeedBack.push({
        formControll: "uuid-aluno",
        feedbackMSG: "campo obrigatorio",
      });
    }

    if (!this.semestre && this.semestre !== 0) {
      this.formErrorFeedBack.push({
        formControll: "semestre",
        feedbackMSG: "campo obrigatorio",
      });
    } else if (!Number.isInteger(this.semestre) || this.semestre <= 0) {
      this.formErrorFeedBack.push({
        formControll: "semestre",
        feedbackMSG: "semestre invalido",
      });
    }
  }

  async post() {
    let alunoList = await Alunos.findByUUID(this.uuidAluno);
    if (alunoList.length <= 0) {
      return {
        status: 400,
        message: "ID Aluno Invalido",
        errorFeedback: [
          {
            formControll: "uuid-aluno",
            feedbackMSG: "Invalido",
          },
        ],
      };
    }

    let cursoList = await Cursos.findInternalByUUID(this.uuidCurso);
    if (cursoList.length <= 0) {
      return {
        status: 400,
        message: "ID Curso Invalido",
        errorFeedback: [
          {
            formControll: "uuid-curso",
            feedbackMSG: "Invalido",
          },
        ],
      };
    }

    let alunoInfo: any = alunoList[0];
    let cursoInfo: any = cursoList[0];

    if (cursoInfo?.Semestre && this.semestre > Number(cursoInfo.Semestre)) {
      return {
        status: 400,
        message: "Semestre invalido para o curso",
        errorFeedback: [
          {
            formControll: "semestre",
            feedbackMSG: "Semestre invalido para o curso",
          },
        ],
      };
    }

    let matriculaExist = await Matriculas.findByAlunoCursoSemestre(
      Number(alunoInfo.ID),
      Number(cursoInfo.ID),
      this.semestre,
      1
    );

    if (matriculaExist.length) {
      return {
        status: 400,
        message: "Aluno ja matriculado neste semestre",
        errorFeedback: [
          {
            formControll: "semestre",
            feedbackMSG: "Aluno ja matriculado neste semestre",
          },
        ],
      };
    }

    let matriculaCreated = await Matriculas.createNew({
      ID_Aluno: Number(alunoInfo.ID),
      ID_Curso: Number(cursoInfo.ID),
      Semestre: this.semestre,
    });

    if (typeof matriculaCreated == "object" && ("ID" in matriculaCreated)) {
      return {
        status: 201,
        message: "Matricula criada com sucesso",
        result: [matriculaCreated],
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
      error: new Error("Nao foi possivel criar a matricula"),
    };
  }
}
