import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Alunos } from "../Alunos";

export class AddContactInfoAlunosForms {
  private uuid: string = "";
  private email: string = "";
  private phone: string = "";
  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(uuid: string, fields: Fields) {
    if ("email" in fields && "phone" in fields) {
      this.uuid = uuid;
      this.email = ((fields["email"] as unknown) as string)?.trim() ?? "";
      this.phone = ((fields["phone"] as unknown) as string)?.trim() ?? "";
      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "email",
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) {
      this.formErrorFeedBack.push({
        formControll: "email",
        feedbackMSG: "email invalido",
      });
    }

    const phoneRegex = /^[95]\d{6}$/;
    if (!this.phone || !phoneRegex.test(this.phone)) {
      this.formErrorFeedBack.push({
        formControll: "phone",
        feedbackMSG: "telefone invalido",
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

    let alunoUpdated = await Alunos.updateContact({
      UUID: this.uuid,
      Email: this.email,
      Phone: this.phone,
    });

    if (alunoUpdated) {
      return {
        status: 200,
        message: "Contacto atualizado com sucesso",
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
      error: new Error("Nao foi possivel atualizar contacto"),
    };
  }
}
