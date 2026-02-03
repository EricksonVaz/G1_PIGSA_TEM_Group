import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { propinas, propinasId } from './propinas';

export interface pagamentosAttributes {
  ID: number;
  ID_Prop: number;
  Metodo: string;
  Montante: number;
  RequestDataMetodo: string;
  ResponseDataMetodo: string;
  DataPagamento: Date;
  UpdateDate?: Date;
  status: number;
}

export type pagamentosPk = "ID";
export type pagamentosId = pagamentos[pagamentosPk];
export type pagamentosOptionalAttributes = "ID" | "DataPagamento" | "UpdateDate" | "status";
export type pagamentosCreationAttributes = Optional<pagamentosAttributes, pagamentosOptionalAttributes>;

export class pagamentos extends Model<pagamentosAttributes, pagamentosCreationAttributes> implements pagamentosAttributes {
  ID!: number;
  ID_Prop!: number;
  Metodo!: string;
  Montante!: number;
  RequestDataMetodo!: string;
  ResponseDataMetodo!: string;
  DataPagamento!: Date;
  UpdateDate?: Date;
  status!: number;

  // pagamentos belongsTo propinas via ID_Prop
  ID_Prop_propina!: propinas;
  getID_Prop_propina!: Sequelize.BelongsToGetAssociationMixin<propinas>;
  setID_Prop_propina!: Sequelize.BelongsToSetAssociationMixin<propinas, propinasId>;
  createID_Prop_propina!: Sequelize.BelongsToCreateAssociationMixin<propinas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof pagamentos {
    return pagamentos.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    ID_Prop: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'propinas',
        key: 'ID'
      }
    },
    Metodo: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    Montante: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: false
    },
    RequestDataMetodo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ResponseDataMetodo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    DataPagamento: {
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
    tableName: 'pagamentos',
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
        name: "ID_Prop",
        using: "BTREE",
        fields: [
          { name: "ID_Prop" },
        ]
      },
    ]
  });
  }
}
