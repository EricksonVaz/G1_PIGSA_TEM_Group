import { sequelize } from "../db/sequelize";
import { notas, notasAttributes } from "./data/notas";

export interface ICreateNota {
  ID_Matricula: number;
  ID_Disciplina: number;
  Nota: number;
  StatusDisciplina: "aprovado" | "reprovado";
}

export class Notas extends notas {
  static modelInstance() {
    let model = notas.initModel(sequelize);
    return model;
  }

  static async findByMatriculaDisciplina(idMatricula: number, idDisciplina: number) {
    const [rows] = await sequelize.query(
      "SELECT ID, ID_Matricula, ID_Disciplina, Nota, StatusDisciplina, DataPublicacao, status FROM `notas` WHERE status = 1 AND ID_Matricula = :idMatricula AND ID_Disciplina = :idDisciplina;",
      { replacements: { idMatricula, idDisciplina } }
    );

    return rows as notasAttributes[];
  }

  static async createNew(objToSave: ICreateNota) {
    const { ID_Matricula, ID_Disciplina, Nota, StatusDisciplina } = objToSave;

    let resourceCreate = await this.modelInstance().create({
      ID_Matricula,
      ID_Disciplina,
      Nota,
      StatusDisciplina,
      status: 1,
    });

    await resourceCreate.reload();
    return resourceCreate;
  }

  static async deleteById(id: number) {
    return this.modelInstance().destroy({
      where: {
        ID: id,
      },
    });
  }

  static async listarMatriculas(filterCurso: string) {
    const filtro = (filterCurso ?? "").toString().trim();

    let cursosQuery =
      "SELECT ID, UUID, Nome FROM `cursos` WHERE status = 1";
    let cursosReplacements: any = {};
    if (filtro && filtro.toLowerCase() !== "all") {
      cursosQuery += " AND UUID = :uuidCurso";
      cursosReplacements.uuidCurso = filtro;
    }

    const [cursosRows] = await sequelize.query(cursosQuery + ";", {
      replacements: cursosReplacements,
    });

    const cursos = cursosRows as any[];
    if (!cursos.length) {
      return {
        status: 200,
        message: "Nenhum curso encontrado",
        result: [],
      };
    }

    const cursoIds = cursos.map((c) => Number(c.ID));

    const [disciplinasRows] = await sequelize.query(
      "SELECT d.ID, d.ID_Curso, d.Semestre, uc.Nome AS NomeDisciplina FROM `disciplinas` d INNER JOIN `unidades_curriculares` uc ON uc.ID = d.ID_UC WHERE d.ID_Curso IN (:cursoIds) ORDER BY d.Semestre ASC, uc.Nome ASC;",
      { replacements: { cursoIds } }
    );
    const disciplinas = disciplinasRows as any[];

    const [matriculasRows] = await sequelize.query(
      "SELECT m.ID, m.ID_Aluno, m.ID_Curso, m.Semestre, a.UUID AS AlunoUUID, a.Nome AS AlunoNome, a.DataNascimento, a.NIF, c.UUID AS CursoUUID, c.Nome AS CursoNome FROM `matriculas` m INNER JOIN `alunos` a ON a.ID = m.ID_Aluno INNER JOIN `cursos` c ON c.ID = m.ID_Curso WHERE m.status = 1 AND a.status = 1 AND c.status = 1 AND m.ID_Curso IN (:cursoIds) ORDER BY a.Nome ASC, c.Nome ASC;",
      { replacements: { cursoIds } }
    );
    const matriculas = matriculasRows as any[];

    if (!matriculas.length) {
      return {
        status: 200,
        message: "Nenhuma matricula encontrada",
        result: [],
      };
    }

    const disciplinasMap = new Map<number, any[]>();
    disciplinas.forEach((d) => {
      const cursoId = Number(d.ID_Curso);
      if (!disciplinasMap.has(cursoId)) {
        disciplinasMap.set(cursoId, []);
      }
      disciplinasMap.get(cursoId)!.push(d);
    });

    const matriculasMap = new Map<string, Map<number, number>>();
    matriculas.forEach((m) => {
      const key = `${m.ID_Aluno}-${m.ID_Curso}`;
      if (!matriculasMap.has(key)) {
        matriculasMap.set(key, new Map<number, number>());
      }
      matriculasMap.get(key)!.set(Number(m.Semestre), Number(m.ID));
    });

    const result: any[] = [];
    const seen = new Set<string>();

    const matriculaIds = matriculas.map((m) => Number(m.ID));
    const notasMap = new Map<string, { nota: number; status: string }>();
    if (matriculaIds.length) {
      const [notasRows] = await sequelize.query(
        "SELECT ID_Matricula, ID_Disciplina, Nota, StatusDisciplina FROM `notas` WHERE status = 1 AND ID_Matricula IN (:matriculaIds);",
        { replacements: { matriculaIds } }
      );
      const notas = notasRows as any[];
      notas.forEach((n) => {
        notasMap.set(`${Number(n.ID_Matricula)}-${Number(n.ID_Disciplina)}`, {
          nota: Number(n.Nota),
          status: (n.StatusDisciplina ?? "").toString(),
        });
      });
    }

    matriculas.forEach((m) => {
      const key = `${m.ID_Aluno}-${m.ID_Curso}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);

      const cursoId = Number(m.ID_Curso);
      const disciplinasCurso = disciplinasMap.get(cursoId) ?? [];
      const matriculasPorSemestre = matriculasMap.get(key) ?? new Map<number, number>();

      const disciplinasOutput = disciplinasCurso.map((d) => {
        const semestre = Number(d.Semestre);
        const idMatricula = matriculasPorSemestre.get(semestre);
        const notaKey = idMatricula ? `${idMatricula}-${Number(d.ID)}` : "";
        const notaInfo = idMatricula && notasMap.has(notaKey) ? notasMap.get(notaKey)! : null;
        const nota = notaInfo ? notaInfo.nota : null;
        const statusDisciplina = notaInfo ? notaInfo.status : null;
        return {
          ID_Disciplina: Number(d.ID),
          Semestre: semestre,
          Nome: d.NomeDisciplina,
          ID_Matricula: idMatricula ?? null,
          Matriculado: idMatricula ? "sim" : "nao",
          Nota: nota,
          StatusDisciplina: statusDisciplina,
        };
      });

      result.push({
        UUID_Aluno: m.AlunoUUID,
        Nome: m.AlunoNome,
        DataNascimento: m.DataNascimento,
        NIF: m.NIF,
        UUID_Curso: m.CursoUUID,
        Disciplinas: disciplinasOutput,
      });
    });

    return {
      status: 200,
      message: "Matriculas encontradas",
      result,
    };
  }

  static async listNotasPublicadasByAlunoCurso(idAluno: number, uuidCurso: string) {
    const [rows] = await sequelize.query(
      "SELECT d.Semestre AS Semestre, uc.Nome AS NomeDisciplina, n.Nota AS Nota, n.StatusDisciplina AS StatusDisciplina FROM `notas` n INNER JOIN `matriculas` m ON m.ID = n.ID_Matricula INNER JOIN `disciplinas` d ON d.ID = n.ID_Disciplina INNER JOIN `unidades_curriculares` uc ON uc.ID = d.ID_UC INNER JOIN `cursos` c ON c.ID = m.ID_Curso INNER JOIN `alunos` a ON a.ID = m.ID_Aluno WHERE n.status = 1 AND m.status = 1 AND c.status = 1 AND a.status = 1 AND uc.status = 1 AND m.ID_Aluno = :idAluno AND c.UUID = :uuidCurso ORDER BY d.Semestre ASC, uc.Nome ASC;",
      { replacements: { idAluno, uuidCurso } }
    );

    return rows as any[];
  }
}
