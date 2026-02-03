import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { alunos, alunosId } from './alunos';

export interface notificacoesAttributes {
  ID: number;
  Metodo: string;
  RequestData: string;
  ResponseData: string;
  DataEnvio: Date;
  SentTo: number;
}

export type notificacoesPk = "ID";
export type notificacoesId = notificacoes[notificacoesPk];
export type notificacoesOptionalAttributes = "ID" | "DataEnvio";
export type notificacoesCreationAttributes = Optional<notificacoesAttributes, notificacoesOptionalAttributes>;

export class notificacoes extends Model<notificacoesAttributes, notificacoesCreationAttributes> implements notificacoesAttributes {
  ID!: number;
  Metodo!: string;
  RequestData!: string;
  ResponseData!: string;
  DataEnvio!: Date;
  SentTo!: number;

  // notificacoes belongsTo alunos via SentTo
  SentTo_aluno!: alunos;
  getSentTo_aluno!: Sequelize.BelongsToGetAssociationMixin<alunos>;
  setSentTo_aluno!: Sequelize.BelongsToSetAssociationMixin<alunos, alunosId>;
  createSentTo_aluno!: Sequelize.BelongsToCreateAssociationMixin<alunos>;

  static initModel(sequelize: Sequelize.Sequelize): typeof notificacoes {
    return notificacoes.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    Metodo: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    RequestData: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ResponseData: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    DataEnvio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    SentTo: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'alunos',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'notificacoes',
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
        name: "SentTo",
        using: "BTREE",
        fields: [
          { name: "SentTo" },
        ]
      },
    ]
  });
  }
}
