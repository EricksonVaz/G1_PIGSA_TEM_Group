import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { disciplinas, disciplinasId } from './disciplinas';
import type { matriculas, matriculasId } from './matriculas';

export interface notasAttributes {
  ID: number;
  ID_Matricula: number;
  ID_Disciplina: number;
  Nota: number;
  StatusDisciplina: 'aprovado' | 'reprovado' | '' | '';
  DataPublicacao: Date;
  status: number;
}

export type notasPk = "ID";
export type notasId = notas[notasPk];
export type notasOptionalAttributes = "ID" | "DataPublicacao" | "status";
export type notasCreationAttributes = Optional<notasAttributes, notasOptionalAttributes>;

export class notas extends Model<notasAttributes, notasCreationAttributes> implements notasAttributes {
  ID!: number;
  ID_Matricula!: number;
  ID_Disciplina!: number;
  Nota!: number;
  StatusDisciplina!: 'aprovado' | 'reprovado' | '' | '';
  DataPublicacao!: Date;
  status!: number;

  // notas belongsTo disciplinas via ID_Disciplina
  ID_Disciplina_disciplina!: disciplinas;
  getID_Disciplina_disciplina!: Sequelize.BelongsToGetAssociationMixin<disciplinas>;
  setID_Disciplina_disciplina!: Sequelize.BelongsToSetAssociationMixin<disciplinas, disciplinasId>;
  createID_Disciplina_disciplina!: Sequelize.BelongsToCreateAssociationMixin<disciplinas>;
  // notas belongsTo matriculas via ID_Matricula
  ID_Matricula_matricula!: matriculas;
  getID_Matricula_matricula!: Sequelize.BelongsToGetAssociationMixin<matriculas>;
  setID_Matricula_matricula!: Sequelize.BelongsToSetAssociationMixin<matriculas, matriculasId>;
  createID_Matricula_matricula!: Sequelize.BelongsToCreateAssociationMixin<matriculas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof notas {
    return notas.init({
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
    ID_Disciplina: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'disciplinas',
        key: 'ID'
      }
    },
    Nota: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: false
    },
    StatusDisciplina: {
      type: DataTypes.ENUM('aprovado','reprovado','',''),
      allowNull: false
    },
    DataPublicacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'notas',
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
        name: "ID_Matricula",
        using: "BTREE",
        fields: [
          { name: "ID_Matricula" },
        ]
      },
      {
        name: "ID_Disciplina",
        using: "BTREE",
        fields: [
          { name: "ID_Disciplina" },
        ]
      },
    ]
  });
  }
}
