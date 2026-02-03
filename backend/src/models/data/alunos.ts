import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { matriculas, matriculasId } from './matriculas';
import type { notificacoes, notificacoesId } from './notificacoes';

export interface alunosAttributes {
  ID: number;
  UUID: string;
  Nome: string;
  CodigoAcesso: number;
  Email: string;
  Phone: string;
  Password: string;
  DocID: string;
  NIF: number;
  Pai: string;
  Mae: string;
  Endereco: string;
  CreationDate: Date;
  UpdateDate?: Date;
  status: number;
}

export type alunosPk = "ID";
export type alunosId = alunos[alunosPk];
export type alunosOptionalAttributes = "ID" | "CreationDate" | "UpdateDate" | "status";
export type alunosCreationAttributes = Optional<alunosAttributes, alunosOptionalAttributes>;

export class alunos extends Model<alunosAttributes, alunosCreationAttributes> implements alunosAttributes {
  ID!: number;
  UUID!: string;
  Nome!: string;
  CodigoAcesso!: number;
  Email!: string;
  Phone!: string;
  Password!: string;
  DocID!: string;
  NIF!: number;
  Pai!: string;
  Mae!: string;
  Endereco!: string;
  CreationDate!: Date;
  UpdateDate?: Date;
  status!: number;

  // alunos hasMany matriculas via ID_Aluno
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
  // alunos hasMany notificacoes via SentTo
  notificacos!: notificacoes[];
  getNotificacos!: Sequelize.HasManyGetAssociationsMixin<notificacoes>;
  setNotificacos!: Sequelize.HasManySetAssociationsMixin<notificacoes, notificacoesId>;
  addNotificaco!: Sequelize.HasManyAddAssociationMixin<notificacoes, notificacoesId>;
  addNotificacos!: Sequelize.HasManyAddAssociationsMixin<notificacoes, notificacoesId>;
  createNotificaco!: Sequelize.HasManyCreateAssociationMixin<notificacoes>;
  removeNotificaco!: Sequelize.HasManyRemoveAssociationMixin<notificacoes, notificacoesId>;
  removeNotificacos!: Sequelize.HasManyRemoveAssociationsMixin<notificacoes, notificacoesId>;
  hasNotificaco!: Sequelize.HasManyHasAssociationMixin<notificacoes, notificacoesId>;
  hasNotificacos!: Sequelize.HasManyHasAssociationsMixin<notificacoes, notificacoesId>;
  countNotificacos!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof alunos {
    return alunos.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    UUID: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      unique: "UUID"
    },
    Nome: {
      type: DataTypes.CHAR(100),
      allowNull: false
    },
    CodigoAcesso: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      unique: "CodigoAcesso"
    },
    Email: {
      type: DataTypes.CHAR(30),
      allowNull: false
    },
    Phone: {
      type: DataTypes.CHAR(20),
      allowNull: false
    },
    Password: {
      type: DataTypes.CHAR(12),
      allowNull: false
    },
    DocID: {
      type: DataTypes.CHAR(30),
      allowNull: false
    },
    NIF: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    Pai: {
      type: DataTypes.CHAR(100),
      allowNull: false
    },
    Mae: {
      type: DataTypes.CHAR(100),
      allowNull: false
    },
    Endereco: {
      type: DataTypes.CHAR(100),
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
    tableName: 'alunos',
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
        name: "UUID",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "UUID" },
        ]
      },
      {
        name: "CodigoAcesso",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CodigoAcesso" },
        ]
      },
    ]
  });
  }
}
