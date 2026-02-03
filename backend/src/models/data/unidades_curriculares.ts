import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { disciplinas, disciplinasId } from './disciplinas';

export interface unidades_curricularesAttributes {
  ID: number;
  UUID: string;
  Nome: string;
  Faculdade: string;
  CreationDate: Date;
  UpdateDate?: Date;
  status: number;
}

export type unidades_curricularesPk = "ID";
export type unidades_curricularesId = unidades_curriculares[unidades_curricularesPk];
export type unidades_curricularesOptionalAttributes = "ID" | "CreationDate" | "UpdateDate" | "status";
export type unidades_curricularesCreationAttributes = Optional<unidades_curricularesAttributes, unidades_curricularesOptionalAttributes>;

export class unidades_curriculares extends Model<unidades_curricularesAttributes, unidades_curricularesCreationAttributes> implements unidades_curricularesAttributes {
  ID!: number;
  UUID!: string;
  Nome!: string;
  Faculdade!: string;
  CreationDate!: Date;
  UpdateDate?: Date;
  status!: number;

  // unidades_curriculares hasMany disciplinas via ID_UC
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

  static initModel(sequelize: Sequelize.Sequelize): typeof unidades_curriculares {
    return unidades_curriculares.init({
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
    Faculdade: {
      type: DataTypes.CHAR(10),
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
    tableName: 'unidades_curriculares',
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
        using: "BTREE",
        fields: [
          { name: "UUID" },
        ]
      },
    ]
  });
  }
}
