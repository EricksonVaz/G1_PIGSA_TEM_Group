import { Fields } from "formidable";
import { IFormErrorFeedback } from "../interfaces/IFormErrorFeedback";
import { Alunos } from "../Alunos";
import { ConsultaLocalVoto } from "../ConsultaLocalVoto";
import { EfacturaConsultaNIF } from "../EfacturaConsultaNIF";
import stringSimilarity from "string-similarity";

export class RegisterAlunosInfoForms {
  private nomeCompleto: string = "";
  private dataNascimento: string = "";
  private nif: string = "";
  private formErrorFeedBack?: IFormErrorFeedback[];

  constructor(fields: Fields) {
    if ("nome-completo" in fields && "data-nascimento" in fields && "nif" in fields) {
      this.nomeCompleto = ((fields["nome-completo"] as unknown) as string)?.trim() ?? "";
      this.dataNascimento = ((fields["data-nascimento"] as unknown) as string)?.trim() ?? "";
      this.nif = ((fields["nif"] as unknown) as string)?.trim() ?? "";
      this.validateForm();
    } else {
      this.formErrorFeedBack = [
        {
          formControll: "nome-completo",
          feedbackMSG: "dados submetidos invalidos",
        },
      ];
    }
  }

  checkValidity() {
    return this.formErrorFeedBack;
  }

  private parseDate(dateStr: string) {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts.map((p) => Number(p));
    if (!dd || !mm || !yyyy) return null;
    const date = new Date(yyyy, mm - 1, dd);
    if (Number.isNaN(date.getTime())) return null;
    if (date.getDate() !== dd || date.getMonth() !== mm - 1 || date.getFullYear() !== yyyy)
      return null;
    return date;
  }

  private toDateOnlyString(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  private getAge(date: Date) {
    const now = new Date();
    let age = now.getFullYear() - date.getFullYear();
    const m = now.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < date.getDate())) {
      age -= 1;
    }
    return age;
  }

  private normalizeName(value: string) {
    return value
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  validateForm() {
    this.formErrorFeedBack = [];

    if (!this.nomeCompleto) {
      this.formErrorFeedBack.push({
        formControll: "nome-completo",
        feedbackMSG: "campo obrigatorio",
      });
    }

    const nifValid = /^\d{9}$/.test(this.nif);
    if (!this.nif || !nifValid) {
      this.formErrorFeedBack.push({
        formControll: "nif",
        feedbackMSG: "NIF invalido",
      });
    }

    const parsedDate = this.parseDate(this.dataNascimento);
    if (!this.dataNascimento || !parsedDate) {
      this.formErrorFeedBack.push({
        formControll: "data-nascimento",
        feedbackMSG: "data invalida",
      });
    } else {
      const age = this.getAge(parsedDate);
      if (age < 18) {
        this.formErrorFeedBack.push({
          formControll: "data-nascimento",
          feedbackMSG: "aluno menor de idade",
        });
      }
    }
  }

  async post() {
    let nifNumber = Number(this.nif);

    let alunoExist = await Alunos.findByNIF(nifNumber);
    if (alunoExist.length) {
      return {
        status: 400,
        message: "ja existe um aluno com este NIF",
        errorFeedback: [
          {
            formControll: "nif",
            feedbackMSG: "ja existe um aluno com este NIF",
          },
        ],
      };
    }

    const efacturaResponse: any = await EfacturaConsultaNIF.consultar(this.nif);
    if (!efacturaResponse?.succeeded || !efacturaResponse?.payload?.length) {
      return {
        status: 400,
        message: "Nao foi possivel validar o NIF",
        errorFeedback: [
          {
            formControll: "nif",
            feedbackMSG: "NIF nao encontrado",
          },
        ],
      };
    }

    const efacturaPayload = efacturaResponse.payload[0] ?? {};
    if (efacturaPayload?.TaxId && Number(efacturaPayload.TaxId) !== nifNumber) {
      return {
        status: 400,
        message: "NIF nao corresponde",
        errorFeedback: [
          {
            formControll: "nif",
            feedbackMSG: "NIF nao corresponde",
          },
        ],
      };
    }

    const nomeNif = (efacturaPayload?.Name ?? "").toString().trim();
    if (!nomeNif) {
      return {
        status: 400,
        message: "Nao foi possivel validar o NIF",
        errorFeedback: [
          {
            formControll: "nif",
            feedbackMSG: "Nome associado ao NIF nao encontrado",
          },
        ],
      };
    }

    const similarity = stringSimilarity.compareTwoStrings(
      this.normalizeName(this.nomeCompleto),
      this.normalizeName(nomeNif)
    );
    if (similarity < 0.9) {
      return {
        status: 400,
        message: "Nome passado e nome associado ao NIF muito diferente",
        errorFeedback: [
          {
            formControll: "nome-completo",
            feedbackMSG: `Nome passado e nome associado ao NIF muito diferente, ${this.nomeCompleto}, NIF: ${nomeNif}`,
          },
        ],
      };
    }

    const cneResponse = await ConsultaLocalVoto.consultar(
      this.nomeCompleto,
      this.dataNascimento
    );
    
    const person = cneResponse?.data?.result?.person;
    if (!cneResponse?.success || !person) {
      return {
        status: 400,
        message: "Nao foi possivel validar os dados pessoais",
        errorFeedback: [
          {
            formControll: "nome-completo",
            feedbackMSG: "dados pessoais nao encontrados",
          },
        ],
      };
    }

    const nome = (efacturaPayload?.Name ?? person?.nome ?? this.nomeCompleto)?.trim();
    const docId = (person?.identificacao ?? "").trim();
    const pai = (person?.nome_pai ?? "Nao informado").trim();
    const mae = (person?.nome_mae ?? "Nao informado").trim();
    const rawDataNascimento = (person?.data_nascimento ?? this.dataNascimento).trim();
    const parsedDate = this.parseDate(rawDataNascimento);
    const dataNascimento = parsedDate ? this.toDateOnlyString(parsedDate) : rawDataNascimento;
    const enderecoParts = [
      person?.local_voto,
      person?.concelho,
      person?.pos_nome,
    ].filter((p) => (p ?? "").toString().trim().length > 0);
    const endereco =
      enderecoParts.join(" ").trim() || "Nao informado";

    let alunoCreated = await Alunos.createInitial({
      Nome: nome,
      DocID: docId || "Nao informado",
      NIF: nifNumber,
      Pai: pai || "Nao informado",
      Mae: mae || "Nao informado",
      DataNascimento: dataNascimento,
      Endereco: endereco,
    });

    if (typeof alunoCreated == "object" && ("ID" in alunoCreated)) {
      return {
        status: 201,
        message: "Aluno criado com sucesso",
        result: [alunoCreated],
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
      error: new Error("Nao foi possivel criar o aluno"),
    };
  }
}
