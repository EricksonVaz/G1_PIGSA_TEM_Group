import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { alunos, alunosId } from './alunos';
import type { cursos, cursosId } from './cursos';
import type { notas, notasId } from './notas';
import type { propinas, propinasId } from './propinas';

export interface matriculasAttributes {
  ID: number;
  ID_Aluno: number;
  ID_Curso: number;
  Semestre: number;
  DataMatricula: Date;
  UpdateDate?: Date;
  status: number;
}

export type matriculasPk = "ID";
export type matriculasId = matriculas[matriculasPk];
export type matriculasOptionalAttributes = "ID" | "DataMatricula" | "UpdateDate" | "status";
export type matriculasCreationAttributes = Optional<matriculasAttributes, matriculasOptionalAttributes>;

export class matriculas extends Model<matriculasAttributes, matriculasCreationAttributes> implements matriculasAttributes {
  ID!: number;
  ID_Aluno!: number;
  ID_Curso!: number;
  Semestre!: number;
  DataMatricula!: Date;
  UpdateDate?: Date;
  status!: number;

  // matriculas belongsTo alunos via ID_Aluno
  ID_Aluno_aluno!: alunos;
  getID_Aluno_aluno!: Sequelize.BelongsToGetAssociationMixin<alunos>;
  setID_Aluno_aluno!: Sequelize.BelongsToSetAssociationMixin<alunos, alunosId>;
  createID_Aluno_aluno!: Sequelize.BelongsToCreateAssociationMixin<alunos>;
  // matriculas belongsTo cursos via ID_Curso
  ID_Curso_curso!: cursos;
  getID_Curso_curso!: Sequelize.BelongsToGetAssociationMixin<cursos>;
  setID_Curso_curso!: Sequelize.BelongsToSetAssociationMixin<cursos, cursosId>;
  createID_Curso_curso!: Sequelize.BelongsToCreateAssociationMixin<cursos>;
  // matriculas hasMany notas via ID_Matricula
  nota!: notas[];
  getNota!: Sequelize.HasManyGetAssociationsMixin<notas>;
  setNota!: Sequelize.HasManySetAssociationsMixin<notas, notasId>;
  addNotum!: Sequelize.HasManyAddAssociationMixin<notas, notasId>;
  addNota!: Sequelize.HasManyAddAssociationsMixin<notas, notasId>;
  createNotum!: Sequelize.HasManyCreateAssociationMixin<notas>;
  removeNotum!: Sequelize.HasManyRemoveAssociationMixin<notas, notasId>;
  removeNota!: Sequelize.HasManyRemoveAssociationsMixin<notas, notasId>;
  hasNotum!: Sequelize.HasManyHasAssociationMixin<notas, notasId>;
  hasNota!: Sequelize.HasManyHasAssociationsMixin<notas, notasId>;
  countNota!: Sequelize.HasManyCountAssociationsMixin;
  // matriculas hasMany propinas via ID_Matricula
  propinas!: propinas[];
  getPropinas!: Sequelize.HasManyGetAssociationsMixin<propinas>;
  setPropinas!: Sequelize.HasManySetAssociationsMixin<propinas, propinasId>;
  addPropina!: Sequelize.HasManyAddAssociationMixin<propinas, propinasId>;
  addPropinas!: Sequelize.HasManyAddAssociationsMixin<propinas, propinasId>;
  createPropina!: Sequelize.HasManyCreateAssociationMixin<propinas>;
  removePropina!: Sequelize.HasManyRemoveAssociationMixin<propinas, propinasId>;
  removePropinas!: Sequelize.HasManyRemoveAssociationsMixin<propinas, propinasId>;
  hasPropina!: Sequelize.HasManyHasAssociationMixin<propinas, propinasId>;
  hasPropinas!: Sequelize.HasManyHasAssociationsMixin<propinas, propinasId>;
  countPropinas!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof matriculas {
    return matriculas.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    ID_Aluno: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'alunos',
        key: 'ID'
      }
    },
    ID_Curso: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'cursos',
        key: 'ID'
      }
    },
    Semestre: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false
    },
    DataMatricula: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    UpdateDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'matriculas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "ID_Aluno",
        using: "BTREE",
        fields: [
          { name: "ID_Aluno" },
        ]
      },
      {
        name: "ID_Curso",
        using: "BTREE",
        fields: [
          { name: "ID_Curso" },
        ]
      },
    ]
  });
  }
}
