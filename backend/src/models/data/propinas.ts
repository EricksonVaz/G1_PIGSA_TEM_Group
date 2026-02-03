import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { matriculas, matriculasId } from './matriculas';
import type { pagamentos, pagamentosId } from './pagamentos';

export interface propinasAttributes {
  ID: number;
  ID_Matricula: number;
  InvoceID: string;
  Montante: number;
  Referencia: string;
  CreationDate: Date;
}

export type propinasPk = "ID";
export type propinasId = propinas[propinasPk];
export type propinasOptionalAttributes = "ID" | "CreationDate";
export type propinasCreationAttributes = Optional<propinasAttributes, propinasOptionalAttributes>;

export class propinas extends Model<propinasAttributes, propinasCreationAttributes> implements propinasAttributes {
  ID!: number;
  ID_Matricula!: number;
  InvoceID!: string;
  Montante!: number;
  Referencia!: string;
  CreationDate!: Date;

  // propinas belongsTo matriculas via ID_Matricula
  ID_Matricula_matricula!: matriculas;
  getID_Matricula_matricula!: Sequelize.BelongsToGetAssociationMixin<matriculas>;
  setID_Matricula_matricula!: Sequelize.BelongsToSetAssociationMixin<matriculas, matriculasId>;
  createID_Matricula_matricula!: Sequelize.BelongsToCreateAssociationMixin<matriculas>;
  // propinas hasMany pagamentos via ID_Prop
  pagamentos!: pagamentos[];
  getPagamentos!: Sequelize.HasManyGetAssociationsMixin<pagamentos>;
  setPagamentos!: Sequelize.HasManySetAssociationsMixin<pagamentos, pagamentosId>;
  addPagamento!: Sequelize.HasManyAddAssociationMixin<pagamentos, pagamentosId>;
  addPagamentos!: Sequelize.HasManyAddAssociationsMixin<pagamentos, pagamentosId>;
  createPagamento!: Sequelize.HasManyCreateAssociationMixin<pagamentos>;
  removePagamento!: Sequelize.HasManyRemoveAssociationMixin<pagamentos, pagamentosId>;
  removePagamentos!: Sequelize.HasManyRemoveAssociationsMixin<pagamentos, pagamentosId>;
  hasPagamento!: Sequelize.HasManyHasAssociationMixin<pagamentos, pagamentosId>;
  hasPagamentos!: Sequelize.HasManyHasAssociationsMixin<pagamentos, pagamentosId>;
  countPagamentos!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof propinas {
    return propinas.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    ID_Matricula: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'matriculas',
        key: 'ID'
      }
    },
    InvoceID: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      unique: "InvoceID"
    },
    Montante: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: false
    },
    Referencia: {
      type: DataTypes.CHAR(20),
      allowNull: false
    },
    CreationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'propinas',
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
        name: "InvoceID",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "InvoceID" },
        ]
      },
      {
        name: "ID_Matricula",
        using: "BTREE",
        fields: [
          { name: "ID_Matricula" },
        ]
      },
    ]
  });
  }
}
