import { sequelize } from "../db/sequelize";
import { propinas, propinasAttributes } from "./data/propinas";

export interface ICreatePropina {
  ID_Matricula: number;
  InvoceID: string;
  Montante: number;
  Referencia: string;
}

export class Propinas extends propinas {
  static modelInstance() {
    let model = propinas.initModel(sequelize);
    return model;
  }

  static async findByInvoceID(invoceId: string) {
    const [rows] = await sequelize.query(
      "SELECT ID, ID_Matricula, InvoceID, Montante, Referencia, status FROM `propinas` WHERE InvoceID = :invoceId;",
      { replacements: { invoceId } }
    );

    return rows as propinasAttributes[];
  }

  static async createMany(listToSave: ICreatePropina[]) {
    let resourceCreate = await this.modelInstance().bulkCreate(
      listToSave.map((item) => ({
        ID_Matricula: item.ID_Matricula,
        InvoceID: item.InvoceID,
        Montante: item.Montante,
        Referencia: item.Referencia,
        status: 1,
      }))
    );

    return resourceCreate;
  }

  static async softDeleteByMatriculaId(idMatricula: number) {
    let resourceUpdated = await this.modelInstance().update(
      {
        status: 0,
      },
      {
        where: {
          ID_Matricula: idMatricula,
          status: 1,
        },
      }
    );

    return resourceUpdated[0];
  }

  static async listByAlunoCurso(idAluno: number, uuidCurso: string) {
    const [rows] = await sequelize.query(
      "SELECT p.ID, p.InvoceID, p.Montante, p.Referencia, CASE WHEN COUNT(pg.ID) > 0 THEN 'pago' ELSE 'por pagar' END AS StatusPagamento FROM `propinas` p INNER JOIN `matriculas` m ON m.ID = p.ID_Matricula INNER JOIN `cursos` c ON c.ID = m.ID_Curso INNER JOIN `alunos` a ON a.ID = m.ID_Aluno LEFT JOIN `pagamentos` pg ON pg.ID_Prop = p.ID AND pg.status = 1 WHERE p.status = 1 AND m.status = 1 AND c.status = 1 AND a.status = 1 AND m.ID_Aluno = :idAluno AND c.UUID = :uuidCurso GROUP BY p.ID, p.InvoceID, p.Montante, p.Referencia ORDER BY p.Referencia ASC;",
      { replacements: { idAluno, uuidCurso } }
    );

    return rows as any[];
  }
}
