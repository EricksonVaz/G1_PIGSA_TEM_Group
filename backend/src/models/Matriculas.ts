import { sequelize } from "../db/sequelize";
import { matriculas, matriculasAttributes } from "./data/matriculas";

export interface ICreateMatricula {
  ID_Aluno: number;
  ID_Curso: number;
  Semestre: number;
}

export class Matriculas extends matriculas {
  static modelInstance() {
    let model = matriculas.initModel(sequelize);

    return model;
  }

  static async findById(id: number) {
    const [rows] = await sequelize.query(
      "SELECT ID, ID_Aluno, ID_Curso, Semestre, DataMatricula, UpdateDate, status FROM `matriculas` WHERE ID = :id;",
      { replacements: { id } }
    );

    return rows as matriculasAttributes[];
  }

  static async findByAlunoCursoSemestre(
    idAluno: number,
    idCurso: number,
    semestre: number,
    status?: number
  ) {
    let query =
      "SELECT ID, ID_Aluno, ID_Curso, Semestre, DataMatricula, UpdateDate, status FROM `matriculas` WHERE ID_Aluno = :idAluno AND ID_Curso = :idCurso AND Semestre = :semestre";

    let replacements: any = { idAluno, idCurso, semestre };
    if (typeof status === "number") {
      query += " AND status = :status";
      replacements.status = status;
    }

    const [rows] = await sequelize.query(query + ";", {
      replacements,
    });

    return rows as matriculasAttributes[];
  }

  static async listCursosByAlunoId(idAluno: number) {
    const [rows] = await sequelize.query(
      "SELECT c.UUID AS Uuid, c.Nome, c.Faculdade, c.Grau, c.Semestre, COUNT(m.ID) AS Matriculado FROM `matriculas` m INNER JOIN `cursos` c ON c.ID = m.ID_Curso WHERE m.status = 1 AND c.status = 1 AND m.ID_Aluno = :idAluno GROUP BY c.ID, c.UUID, c.Nome, c.Faculdade, c.Grau, c.Semestre ORDER BY c.Nome ASC;",
      { replacements: { idAluno } }
    );

    return rows as any[];
  }

  static async createNew(objToSave: ICreateMatricula) {
    const { ID_Aluno, ID_Curso, Semestre } = objToSave;

    let resourceCreate = await this.modelInstance().create({
      ID_Aluno,
      ID_Curso,
      Semestre,
      status: 1,
    });

    await resourceCreate.reload();

    return resourceCreate;
  }

  static async softDeleteById(id: number) {
    let resourceUpdated = await this.modelInstance().update(
      {
        status: 0,
      },
      {
        where: {
          ID: id,
          status: 1,
        },
      }
    );

    return resourceUpdated[0];
  }
}
