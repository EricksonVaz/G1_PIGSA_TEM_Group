import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Alunos } from "../Alunos";
import bcrypt from "bcryptjs";

export class UpdatePasswordAlunosForms {
  private uuid: string = "";
  private oldPassword: string = "";
  private newPassword: string = "";
  private confirmPassword: string = "";
  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(uuid: string, fields: Fields) {
    if (fields && typeof fields === "object") {
      this.uuid = uuid;

      const oldRaw =
        fields["old_password"] ??
        fields["old-password"] ??
        fields["oldpassword"] ??
        fields["password_old"] ??
        fields["password-old"];

      const newRaw =
        fields["new_password"] ??
        fields["new-password"] ??
        fields["newpassword"] ??
        fields["password_new"] ??
        fields["password-new"];

      const confirmRaw =
        fields["confirm_password"] ??
        fields["confirm-password"] ??
        fields["confirm-passwod"] ??
        fields["confirmpassword"] ??
        fields["password_confirm"] ??
        fields["password-confirm"];

      this.oldPassword = (oldRaw ?? "").toString().trim();
      this.newPassword = (newRaw ?? "").toString().trim();
      this.confirmPassword = (confirmRaw ?? "").toString().trim();

      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "old_password",
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

    if (!this.oldPassword) {
      this.formErrorFeedBack.push({
        formControll: "old_password",
        feedbackMSG: "campo obrigatorio",
      });
    }

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

    if (this.oldPassword && this.newPassword && this.oldPassword === this.newPassword) {
      this.formErrorFeedBack.push({
        formControll: "new_password",
        feedbackMSG: "nova password deve ser diferente da antiga",
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

    const alunoInfo: any = alunoExist[0];
    if (!alunoInfo?.Password) {
      return {
        status: 400,
        message: "Acesso nao criado",
        errorFeedback: [
          {
            formControll: "old_password",
            feedbackMSG: "Acesso nao criado",
          },
        ],
      };
    }

    const validPassword = await bcrypt.compare(this.oldPassword, alunoInfo.Password);
    if (!validPassword) {
      return {
        status: 400,
        message: "Password antiga invalida",
        errorFeedback: [
          {
            formControll: "old_password",
            feedbackMSG: "Password antiga invalida",
          },
        ],
      };
    }

    const hashedPassword = await bcrypt.hash(this.newPassword, 10);
    let alunoUpdated = await Alunos.updatePassword({
      UUID: this.uuid,
      Password: hashedPassword,
    });

    if (alunoUpdated) {
      return {
        status: 200,
        message: "Password atualizada com sucesso",
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
      error: new Error("Nao foi possivel atualizar password"),
    };
  }
}
