import { sequelize } from "../db/sequelize";
import { disciplinas, disciplinasAttributes } from "./data/disciplinas";

export interface ICreateDisciplinas {
  ID_Curso: number;
  ID_UC: number;
  Semestre: number;
}

export class Disciplinas extends disciplinas {
  static modelInstance() {
    let model = disciplinas.initModel(sequelize);

    return model;
  }

  static async findByCursoAndUC(
    idCurso: number,
    idUc: number,
    semestre?: number
  ) {
    let query =
      "SELECT ID, ID_Curso, ID_UC, Semestre, AddedAT FROM `disciplinas` WHERE ID_Curso = :idCurso AND ID_UC = :idUc";

    let replacements: any = { idCurso, idUc };
    if (typeof semestre === "number") {
      query += " AND Semestre = :semestre";
      replacements.semestre = semestre;
    }

    const [rows] = await sequelize.query(query + ";", {
      replacements,
    });

    return rows as disciplinasAttributes[];
  }

  static async createNew(objToSave: ICreateDisciplinas) {
    const { ID_Curso, ID_UC, Semestre } = objToSave;

    let resourceCreate = await this.modelInstance().create({
      ID_Curso,
      ID_UC,
      Semestre,
    });

    await resourceCreate.reload();

    return resourceCreate;
  }

  static async deleteByCursoAndUC(
    idCurso: number,
    idUc: number,
    semestre?: number
  ) {
    let where: any = {
      ID_Curso: idCurso,
      ID_UC: idUc,
    };

    if (typeof semestre === "number") {
      where.Semestre = semestre;
    }

    return this.modelInstance().destroy({ where });
  }
}
