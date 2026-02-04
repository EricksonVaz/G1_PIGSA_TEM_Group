import { randomUUID } from "crypto";
import { sequelize } from "../db/sequelize";
import { alunos, alunosAttributes } from "./data/alunos";

export interface ICreateAlunoInitial {
  Nome: string;
  DocID: string;
  NIF: number;
  Pai: string;
  Mae: string;
  Endereco: string;
}

export interface IUpdateAlunoAccess {
  UUID: string;
  Password: string;
  CodigoAcesso?: string;
}

export interface IUpdateAlunoContact {
  UUID: string;
  Email: string;
  Phone: string;
}

export class Alunos extends alunos {
  static modelInstance() {
    let model = alunos.initModel(sequelize);
    return model;
  }

  static async findByUUID(uuid: string) {
    const [rows] = await sequelize.query(
      "SELECT ID, UUID, Nome, CodigoAcesso, Email, Phone, Password, DocID, NIF, Pai, Mae, Endereco FROM `alunos` WHERE status = 1 AND UUID = :uuid;",
      { replacements: { uuid } }
    );

    return rows as alunosAttributes[];
  }

  static async findByNIF(nif: number) {
    const [rows] = await sequelize.query(
      "SELECT ID, UUID, Nome, CodigoAcesso, Email, Phone, DocID, NIF, Pai, Mae, Endereco FROM `alunos` WHERE status = 1 AND NIF = :nif;",
      { replacements: { nif } }
    );

    return rows as alunosAttributes[];
  }

  static async findByCodigoAcesso(codigoAcesso: string) {
    const [rows] = await sequelize.query(
      "SELECT ID, UUID FROM `alunos` WHERE status = 1 AND CodigoAcesso = :codigoAcesso;",
      { replacements: { codigoAcesso } }
    );

    return rows as alunosAttributes[];
  }

  static async createInitial(objToSave: ICreateAlunoInitial) {
    const { Nome, DocID, NIF, Pai, Mae, Endereco } = objToSave;

    let UUID = randomUUID();

    let resourceCreate = await this.modelInstance().create({
      UUID,
      Nome,
      DocID,
      NIF,
      Pai,
      Mae,
      Endereco,
      status: 1,
    });

    await resourceCreate.reload();

    return resourceCreate;
  }

  static async updateAccess(objToSave: IUpdateAlunoAccess) {
    const { UUID, Password, CodigoAcesso } = objToSave;

    let resourceUpdated = await this.modelInstance().update(
      {
        Password,
        CodigoAcesso,
      },
      {
        where: {
          UUID,
        },
      }
    );

    return resourceUpdated[0];
  }

  static async updateContact(objToSave: IUpdateAlunoContact) {
    const { UUID, Email, Phone } = objToSave;

    let resourceUpdated = await this.modelInstance().update(
      {
        Email,
        Phone,
      },
      {
        where: {
          UUID,
        },
      }
    );

    return resourceUpdated[0];
  }

  static async generateUniqueCodigoAcesso() {
    let codigoAcesso:string|undefined;
    while(!codigoAcesso) {
      codigoAcesso = Math.floor(100000 + Math.random() * 900000).toString();
      let existing = await Alunos.findByCodigoAcesso(codigoAcesso);
      if (existing.length === 0) {
        break;
      }
    }

    return codigoAcesso;
  }

  static async deleteAluno(UUID: string) {
    let alunoExist = await Alunos.findByUUID(UUID);
    if (alunoExist.length <= 0) {
      return "not-found";
    }

    let resourceUpdated = await this.modelInstance().update(
      {
        status: 0,
      },
      {
        where: {
          UUID,
        },
      }
    );

    return resourceUpdated[0];
  }
}
