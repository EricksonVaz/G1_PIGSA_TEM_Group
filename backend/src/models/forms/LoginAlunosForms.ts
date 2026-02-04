import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Alunos } from "../Alunos";
import bcrypt from "bcryptjs";
import { getToken } from "../../utils/handleJWT";

export class LoginAlunosForms {
  private codigoAcesso: string = "";
  private password: string = "";
  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(fields: Fields) {
    if (fields && typeof fields === "object") {
      const codigoRaw = fields["codigo_acesso"] ?? fields["codigo-acesso"];
      const passwordRaw = fields["password"];

      this.codigoAcesso = (codigoRaw ?? "").toString().trim();
      this.password = (passwordRaw ?? "").toString().trim();
      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "codigo_acesso",
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

    if (!this.codigoAcesso) {
      this.formErrorFeedBack.push({
        formControll: "codigo_acesso",
        feedbackMSG: "campo obrigatorio",
      });
    }

    if (!this.password) {
      this.formErrorFeedBack.push({
        formControll: "password",
        feedbackMSG: "campo obrigatorio",
      });
    }
  }

  async post() {
    let alunoList = await Alunos.findByCodigoAcessoWithPassword(this.codigoAcesso);
    if (alunoList.length <= 0) {
      return {
        status: 400,
        message: "Codigo de acesso ou password invalido",
        errorFeedback: [
          {
            formControll: "codigo_acesso",
            feedbackMSG: "Codigo de acesso ou password invalido",
          },
        ],
      };
    }

    const alunoInfo: any = alunoList[0];
    if (!alunoInfo?.Password) {
      return {
        status: 400,
        message: "Acesso nao criado",
        errorFeedback: [
          {
            formControll: "password",
            feedbackMSG: "Acesso nao criado",
          },
        ],
      };
    }

    const validPassword = await bcrypt.compare(this.password, alunoInfo.Password);
    if (!validPassword) {
      return {
        status: 400,
        message: "Codigo de acesso ou password invalido",
        errorFeedback: [
          {
            formControll: "password",
            feedbackMSG: "Codigo de acesso ou password invalido",
          },
        ],
      };
    }

    const jwt = getToken({
      id: alunoInfo.UUID,
      name: alunoInfo.Nome,
      access: alunoInfo.CodigoAcesso,
    });

    return {
      status: 200,
      message: "Login realizado com sucesso",
      jwt,
    };
  }
}
