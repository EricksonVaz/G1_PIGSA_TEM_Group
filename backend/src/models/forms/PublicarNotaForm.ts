import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Notas } from "../Notas";
import { Notificacoes } from "../Notificacoes";
import { transporterSendEmail } from "../../utils/send-emails";
import { sendSMS } from "../../utils/send-sms";
import { sequelize } from "../../db/sequelize";

export class PublicarNotaForm {
  private idMatricula: number = 0;
  private idDisciplina: number = 0;
  private nota: number = 0;
  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(fields: Fields) {
    if (fields && typeof fields === "object") {
      const idMatriculaRaw = fields["idMatricula"] ?? fields["id-matricula"];
      const idDisciplinaRaw = fields["idDisciplina"] ?? fields["id-disciplina"];
      const notaRaw = fields["nota"];

      this.idMatricula = Number((idMatriculaRaw ?? "").toString().trim());
      this.idDisciplina = Number((idDisciplinaRaw ?? "").toString().trim());
      this.nota = Number((notaRaw ?? "").toString().trim());
      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "id-matricula",
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
        formControll: "id-matricula",
        feedbackMSG: "Invalido",
      });
    }

    if (!this.idDisciplina || Number.isNaN(this.idDisciplina) || this.idDisciplina <= 0) {
      this.formErrorFeedBack.push({
        formControll: "id-disciplina",
        feedbackMSG: "Invalido",
      });
    }

    if (Number.isNaN(this.nota) || this.nota < 0 || this.nota > 20) {
      this.formErrorFeedBack.push({
        formControll: "nota",
        feedbackMSG: "Nota invalida",
      });
    }
  }

  private getStatusDisciplina() {
    return this.nota >= 9.5 ? "aprovado" : "reprovado";
  }

  async post() {
    const statusDisciplina = this.getStatusDisciplina();

    const [contextRows] = await sequelize.query(
      "SELECT m.ID AS MatriculaID, m.Semestre AS MatriculaSemestre, m.status AS MatriculaStatus, a.ID AS AlunoID, a.UUID AS AlunoUUID, a.Nome AS AlunoNome, a.Email, a.Phone, a.DataNascimento, a.NIF, c.ID AS CursoID, c.UUID AS CursoUUID, c.Nome AS CursoNome, d.ID AS DisciplinaID, d.Semestre AS DisciplinaSemestre, uc.Nome AS DisciplinaNome FROM `matriculas` m INNER JOIN `alunos` a ON a.ID = m.ID_Aluno INNER JOIN `cursos` c ON c.ID = m.ID_Curso INNER JOIN `disciplinas` d ON d.ID = :idDisciplina AND d.ID_Curso = c.ID INNER JOIN `unidades_curriculares` uc ON uc.ID = d.ID_UC WHERE m.ID = :idMatricula AND m.status = 1 AND a.status = 1 AND c.status = 1;",
      { replacements: { idMatricula: this.idMatricula, idDisciplina: this.idDisciplina } }
    );

    const context = (contextRows as any[])[0];
    if (!context) {
      return {
        status: 400,
        message: "Matricula ou disciplina invalida",
        errorFeedback: [
          {
            formControll: "id-matricula",
            feedbackMSG: "Matricula ou disciplina invalida",
          },
        ],
      };
    }

    if (Number(context.MatriculaSemestre) !== Number(context.DisciplinaSemestre)) {
      return {
        status: 400,
        message: "Disciplina nao pertence ao semestre da matricula",
        errorFeedback: [
          {
            formControll: "id-disciplina",
            feedbackMSG: "Disciplina nao pertence ao semestre da matricula",
          },
        ],
      };
    }

    let notaExist = await Notas.findByMatriculaDisciplina(
      this.idMatricula,
      this.idDisciplina
    );
    if (notaExist.length) {
      return {
        status: 400,
        message: "Nota ja publicada para esta disciplina",
        errorFeedback: [
          {
            formControll: "id-disciplina",
            feedbackMSG: "Nota ja publicada para esta disciplina",
          },
        ],
      };
    }

    let notaCreated = await Notas.createNew({
      ID_Matricula: this.idMatricula,
      ID_Disciplina: this.idDisciplina,
      Nota: this.nota,
      StatusDisciplina: statusDisciplina,
    });

    let emailEnviado = false;
    let smsEnviado = false;

    const disciplinaNome = context.DisciplinaNome;
    const cursoNome = context.CursoNome;
    const alunoId = Number(context.AlunoID);

    if (context.Email && context.Email.toString().trim()) {
      const to = context.Email.toString().trim();
      const subject = `Nota para a disciplina ${disciplinaNome} foi publicada`;
      const html = `Caro/a foi publicado para a disciplina ${disciplinaNome} no curso ${cursoNome} sua nota final, aceda o portal do aluno para conferir.`;

      try {
        await transporterSendEmail({
          from: "noreplycncsu@gmail.com",
          to,
          subject,
          html,
        });
        emailEnviado = true;
      } catch (error) {
        emailEnviado = false;
      }

      await Notificacoes.createNew({
        Metodo: "email",
        RequestData: JSON.stringify({ to, subject, html }),
        ResponseData: JSON.stringify({
          statusEmailSend: emailEnviado ? "enviado" : "nao enviado",
        }),
        SentTo: alunoId,
      });
    }

    if (context.Phone && context.Phone.toString().trim()) {
      const phone = context.Phone.toString().trim();
      const sms = `Nota da disciplina ${disciplinaNome} Publicada`;

      const smsResponse = await sendSMS(phone, sms);
      smsEnviado = smsResponse?.status === 200;

      await Notificacoes.createNew({
        Metodo: "sms",
        RequestData: JSON.stringify({ phone, sms }),
        ResponseData: JSON.stringify(smsResponse),
        SentTo: alunoId,
      });
    }

    if (typeof notaCreated == "object" && ("ID" in notaCreated)) {
      return {
        status: 201,
        message: "Nota publicada com sucesso",
        result: [notaCreated],
        emailEnviado,
        smsEnviado,
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
      error: new Error("Nao foi possivel publicar a nota"),
    };
  }
}
