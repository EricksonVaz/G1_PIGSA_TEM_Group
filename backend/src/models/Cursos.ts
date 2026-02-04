import { randomUUID } from "crypto";
import { sequelize } from "../db/sequelize";
import { cursos, cursosAttributes } from "./data/cursos";

export interface ICreateUpdateCursos {
  UUID?: string;
  Nome: string;
  Grau: string;
  Faculdade: string;
  Semestre: number;
}

export class Cursos extends cursos {
  static modelInstance() {
    let model = cursos.initModel(sequelize);

    return model;
  }

  static async getAll() {
    const [rows] = await sequelize.query(
      "SELECT UUID AS ID, Nome, Grau, Faculdade, Semestre FROM `cursos` WHERE status = 1 ORDER BY CreationDate DESC;"
    );

    return rows as cursosAttributes[];
  }

  static async findByNomeGrauSemestre(
    nome: string,
    grau: string,
    faculdade: string,
    semestre: number
  ) {
    const [rows] = await sequelize.query(
      "SELECT UUID AS ID, Nome, Grau, Faculdade, Semestre FROM `cursos` WHERE status = 1 AND Nome = :nome AND Grau = :grau AND Faculdade = :faculdade AND Semestre = :semestre;",
      { replacements: { nome, grau, faculdade, semestre } }
    );

    return rows as cursosAttributes[];
  }

  static async findByUUID(uuid: string) {
    const [rows] = await sequelize.query(
      "SELECT UUID AS ID, Nome, Grau, Faculdade, Semestre FROM `cursos` WHERE status = 1 AND UUID = :uuid;",
      { replacements: { uuid } }
    );

    return rows as cursosAttributes[];
  }

  static async findInternalByUUID(uuid: string) {
    const [rows] = await sequelize.query(
      "SELECT ID, UUID, Nome, Grau, Faculdade, Semestre FROM `cursos` WHERE status = 1 AND UUID = :uuid;",
      { replacements: { uuid } }
    );

    return rows as cursosAttributes[];
  }

  static async existeOtherCursoWithSameInfo(
    uuid: string,
    nome: string,
    grau: string,
    faculdade: string,
    semestre: number
  ) {
    const [rows] = await sequelize.query(
      "SELECT UUID AS ID, Nome, Grau, Faculdade, Semestre FROM `cursos` WHERE status = 1 AND Nome = :nome AND Grau = :grau AND Faculdade = :faculdade AND Semestre = :semestre AND UUID <> :uuid;",
      { replacements: { nome, grau, faculdade, semestre, uuid } }
    );

    return rows.length > 0;
  }

  static async createNew(objToSave: ICreateUpdateCursos) {
    const { Nome, Grau, Faculdade, Semestre } = objToSave;

    let UUID = randomUUID();

    let resourceCreate = await this.modelInstance().create({
      UUID,
      Nome,
      Grau,
      Faculdade,
      Semestre,
      status: 1,
    });

    await resourceCreate.reload();

    return resourceCreate;
  }

  static async updateCurso(objToSave: ICreateUpdateCursos) {
    const { UUID, Nome, Grau, Faculdade, Semestre } = objToSave;

    let resourceUpdated = await this.modelInstance().update(
      {
        Nome,
        Grau,
        Faculdade,
        Semestre,
      },
      {
        where: {
          UUID,
        },
      }
    );

    return resourceUpdated[0];
  }

  static async deleteCurso(UUID: string) {
    let cursoExist = await Cursos.findByUUID(UUID);
    if (cursoExist.length <= 0) {
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
