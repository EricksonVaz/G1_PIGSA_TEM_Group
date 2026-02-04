import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { disciplinas, disciplinasId } from './disciplinas';
import type { matriculas, matriculasId } from './matriculas';

export interface cursosAttributes {
  ID: number;
  UUID: string;
  Nome: string;
  Grau: string;
  Faculdade: string;
  Semestre: number;
  CreationDate: Date;
  UpdateDate?: Date;
  status: number;
}

export type cursosPk = "ID";
export type cursosId = cursos[cursosPk];
export type cursosOptionalAttributes = "ID" | "CreationDate" | "UpdateDate" | "status";
export type cursosCreationAttributes = Optional<cursosAttributes, cursosOptionalAttributes>;

export class cursos extends Model<cursosAttributes, cursosCreationAttributes> implements cursosAttributes {
  ID!: number;
  UUID!: string;
  Nome!: string;
  Grau!: string;
  Faculdade!: string;
  Semestre!: number;
  CreationDate!: Date;
  UpdateDate?: Date;
  status!: number;

  // cursos hasMany disciplinas via ID_Curso
  disciplinas!: disciplinas[];
  getDisciplinas!: Sequelize.HasManyGetAssociationsMixin<disciplinas>;
  setDisciplinas!: Sequelize.HasManySetAssociationsMixin<disciplinas, disciplinasId>;
  addDisciplina!: Sequelize.HasManyAddAssociationMixin<disciplinas, disciplinasId>;
  addDisciplinas!: Sequelize.HasManyAddAssociationsMixin<disciplinas, disciplinasId>;
  createDisciplina!: Sequelize.HasManyCreateAssociationMixin<disciplinas>;
  removeDisciplina!: Sequelize.HasManyRemoveAssociationMixin<disciplinas, disciplinasId>;
  removeDisciplinas!: Sequelize.HasManyRemoveAssociationsMixin<disciplinas, disciplinasId>;
  hasDisciplina!: Sequelize.HasManyHasAssociationMixin<disciplinas, disciplinasId>;
  hasDisciplinas!: Sequelize.HasManyHasAssociationsMixin<disciplinas, disciplinasId>;
  countDisciplinas!: Sequelize.HasManyCountAssociationsMixin;
  // cursos hasMany matriculas via ID_Curso
  matriculas!: matriculas[];
  getMatriculas!: Sequelize.HasManyGetAssociationsMixin<matriculas>;
  setMatriculas!: Sequelize.HasManySetAssociationsMixin<matriculas, matriculasId>;
  addMatricula!: Sequelize.HasManyAddAssociationMixin<matriculas, matriculasId>;
  addMatriculas!: Sequelize.HasManyAddAssociationsMixin<matriculas, matriculasId>;
  createMatricula!: Sequelize.HasManyCreateAssociationMixin<matriculas>;
  removeMatricula!: Sequelize.HasManyRemoveAssociationMixin<matriculas, matriculasId>;
  removeMatriculas!: Sequelize.HasManyRemoveAssociationsMixin<matriculas, matriculasId>;
  hasMatricula!: Sequelize.HasManyHasAssociationMixin<matriculas, matriculasId>;
  hasMatriculas!: Sequelize.HasManyHasAssociationsMixin<matriculas, matriculasId>;
  countMatriculas!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof cursos {
    return cursos.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    UUID: {
      type: DataTypes.CHAR(50),
      allowNull: false
    },
    Nome: {
      type: DataTypes.CHAR(100),
      allowNull: false
    },
    Grau: {
      type: DataTypes.CHAR(30),
      allowNull: false
    },
    Faculdade: {
      type: DataTypes.CHAR(30),
      allowNull: false
    },
    Semestre: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false
    },
    CreationDate: {
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
    tableName: 'cursos',
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
    ]
  });
  }
}
