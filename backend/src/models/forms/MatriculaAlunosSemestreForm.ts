import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Alunos } from "../Alunos";
import { Cursos } from "../Cursos";
import { Matriculas } from "../Matriculas";
import { Propinas } from "../Propinas";

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
      const matriculaId = Number((matriculaCreated as any).ID);
      const propinasList = await this.buildPropinasForSemester(matriculaId, new Date());
      const propinasCreated = await Propinas.createMany(propinasList);
      if (!propinasCreated || propinasCreated.length !== propinasList.length) {
        return {
          status: 500,
          message: "Internal Server Error",
          error: new Error("Nao foi possivel criar propinas"),
        };
      }

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

  private async buildPropinasForSemester(idMatricula: number, startDate: Date) {
    const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const list = [];

    for (let i = 0; i < 6; i++) {
      const dt = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthName = monthNames[dt.getMonth()];
      const referencia = `${monthName}/${dt.getFullYear()}`;

      const invoceId = await this.generateUniqueInvoceID();
      list.push({
        ID_Matricula: idMatricula,
        InvoceID: invoceId,
        Montante: 9000,
        Referencia: referencia,
      });
    }

    return list;
  }

  private async generateUniqueInvoceID() {
    let invoceId = "";
    let tries = 0;
    while (!invoceId) {
      tries++;
      if (tries > 50) {
        throw new Error("Nao foi possivel gerar InvoceID");
      }

      const part4a = this.randomDigits(4);
      const part4b = this.randomDigits(4);
      const part2 = this.randomDigits(2);
      const candidate = `#-${part4a}-${part4b}-${part2}`;

      const exists = await Propinas.findByInvoceID(candidate);
      if (exists.length === 0) {
        invoceId = candidate;
      }
    }

    return invoceId;
  }

  private randomDigits(len: number) {
    let out = "";
    for (let i = 0; i < len; i++) {
      out += Math.floor(Math.random() * 10).toString();
    }
    return out;
  }
}
