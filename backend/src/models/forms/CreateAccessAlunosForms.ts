import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Alunos } from "../Alunos";
import bcrypt from "bcryptjs";

export class CreateAccessAlunosForms {
  private uuid: string = "";
  private newPassword: string = "";
  private confirmPassword: string = "";
  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(uuid: string, fields: Fields) {
    if ("new_password" in fields && "confirm_password" in fields) {
      this.uuid = uuid;
      this.newPassword = ((fields["new_password"] as unknown) as string)?.trim() ?? "";
      this.confirmPassword = ((fields["confirm_password"] as unknown) as string)?.trim() ?? "";
      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "new_password",
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

    if (!this.newPassword || this.newPassword.length < 6) {
      this.formErrorFeedBack.push({
        formControll: "new_password",
        feedbackMSG: "password invalida",
      });
    }

    if (!this.confirmPassword || this.confirmPassword !== this.newPassword) {
      this.formErrorFeedBack.push({
        formControll: "confirm_password",
        feedbackMSG: "password nao confere",
      });
    }
  }

  async post() {
    let alunoExist = await Alunos.findByUUID(this.uuid);
    if (alunoExist.length <= 0) {
      return {
        status: 400,
        message: "ID Aluno Invalido",
        errorFeedback: [
          {
            formControll: "uuid",
            feedbackMSG: "ID Aluno Invalido",
          },
        ],
      };
    }

    let alunoInfo = alunoExist[0] as any;
    let codigoAcesso = alunoInfo?.CodigoAcesso as string | undefined;
    if (!codigoAcesso) {
      codigoAcesso = await Alunos.generateUniqueCodigoAcesso();
      if (!codigoAcesso) {
        return {
          status: 500,
          message: "Nao foi possivel gerar codigo de acesso",
          error: new Error("Nao foi possivel gerar codigo de acesso"),
        };
      }
    }

    const hashedPassword = await bcrypt.hash(this.newPassword, 10);

    let alunoUpdated = await Alunos.updateAccess({
      UUID: this.uuid,
      Password: hashedPassword,
      CodigoAcesso: codigoAcesso,
    });

    if (alunoUpdated) {
      return {
        status: 200,
        message: "Acesso criado com sucesso",
        result: [{ CodigoAcesso: codigoAcesso }],
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
      error: new Error("Nao foi possivel atualizar o acesso"),
    };
  }
}
