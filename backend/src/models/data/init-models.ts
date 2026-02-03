import type { Sequelize } from "sequelize";
import { alunos as _alunos } from "./alunos";
import type { alunosAttributes, alunosCreationAttributes } from "./alunos";
import { cursos as _cursos } from "./cursos";
import type { cursosAttributes, cursosCreationAttributes } from "./cursos";
import { disciplinas as _disciplinas } from "./disciplinas";
import type { disciplinasAttributes, disciplinasCreationAttributes } from "./disciplinas";
import { matriculas as _matriculas } from "./matriculas";
import type { matriculasAttributes, matriculasCreationAttributes } from "./matriculas";
import { notas as _notas } from "./notas";
import type { notasAttributes, notasCreationAttributes } from "./notas";
import { notificacoes as _notificacoes } from "./notificacoes";
import type { notificacoesAttributes, notificacoesCreationAttributes } from "./notificacoes";
import { pagamentos as _pagamentos } from "./pagamentos";
import type { pagamentosAttributes, pagamentosCreationAttributes } from "./pagamentos";
import { propinas as _propinas } from "./propinas";
import type { propinasAttributes, propinasCreationAttributes } from "./propinas";
import { unidades_curriculares as _unidades_curriculares } from "./unidades_curriculares";
import type { unidades_curricularesAttributes, unidades_curricularesCreationAttributes } from "./unidades_curriculares";

export {
  _alunos as alunos,
  _cursos as cursos,
  _disciplinas as disciplinas,
  _matriculas as matriculas,
  _notas as notas,
  _notificacoes as notificacoes,
  _pagamentos as pagamentos,
  _propinas as propinas,
  _unidades_curriculares as unidades_curriculares,
};

export type {
  alunosAttributes,
  alunosCreationAttributes,
  cursosAttributes,
  cursosCreationAttributes,
  disciplinasAttributes,
  disciplinasCreationAttributes,
  matriculasAttributes,
  matriculasCreationAttributes,
  notasAttributes,
  notasCreationAttributes,
  notificacoesAttributes,
  notificacoesCreationAttributes,
  pagamentosAttributes,
  pagamentosCreationAttributes,
  propinasAttributes,
  propinasCreationAttributes,
  unidades_curricularesAttributes,
  unidades_curricularesCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const alunos = _alunos.initModel(sequelize);
  const cursos = _cursos.initModel(sequelize);
  const disciplinas = _disciplinas.initModel(sequelize);
  const matriculas = _matriculas.initModel(sequelize);
  const notas = _notas.initModel(sequelize);
  const notificacoes = _notificacoes.initModel(sequelize);
  const pagamentos = _pagamentos.initModel(sequelize);
  const propinas = _propinas.initModel(sequelize);
  const unidades_curriculares = _unidades_curriculares.initModel(sequelize);

  matriculas.belongsTo(alunos, { as: "ID_Aluno_aluno", foreignKey: "ID_Aluno"});
  alunos.hasMany(matriculas, { as: "matriculas", foreignKey: "ID_Aluno"});
  notificacoes.belongsTo(alunos, { as: "SentTo_aluno", foreignKey: "SentTo"});
  alunos.hasMany(notificacoes, { as: "notificacos", foreignKey: "SentTo"});
  disciplinas.belongsTo(cursos, { as: "ID_Curso_curso", foreignKey: "ID_Curso"});
  cursos.hasMany(disciplinas, { as: "disciplinas", foreignKey: "ID_Curso"});
  matriculas.belongsTo(cursos, { as: "ID_Curso_curso", foreignKey: "ID_Curso"});
  cursos.hasMany(matriculas, { as: "matriculas", foreignKey: "ID_Curso"});
  notas.belongsTo(disciplinas, { as: "ID_Disciplina_disciplina", foreignKey: "ID_Disciplina"});
  disciplinas.hasMany(notas, { as: "nota", foreignKey: "ID_Disciplina"});
  notas.belongsTo(matriculas, { as: "ID_Matricula_matricula", foreignKey: "ID_Matricula"});
  matriculas.hasMany(notas, { as: "nota", foreignKey: "ID_Matricula"});
  propinas.belongsTo(matriculas, { as: "ID_Matricula_matricula", foreignKey: "ID_Matricula"});
  matriculas.hasMany(propinas, { as: "propinas", foreignKey: "ID_Matricula"});
  pagamentos.belongsTo(propinas, { as: "ID_Prop_propina", foreignKey: "ID_Prop"});
  propinas.hasMany(pagamentos, { as: "pagamentos", foreignKey: "ID_Prop"});
  disciplinas.belongsTo(unidades_curriculares, { as: "ID_UC_unidades_curriculare", foreignKey: "ID_UC"});
  unidades_curriculares.hasMany(disciplinas, { as: "disciplinas", foreignKey: "ID_UC"});

  return {
    alunos: alunos,
    cursos: cursos,
    disciplinas: disciplinas,
    matriculas: matriculas,
    notas: notas,
    notificacoes: notificacoes,
    pagamentos: pagamentos,
    propinas: propinas,
    unidades_curriculares: unidades_curriculares,
  };
}
