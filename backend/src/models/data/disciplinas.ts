import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { cursos, cursosId } from './cursos';
import type { notas, notasId } from './notas';
import type { unidades_curriculares, unidades_curricularesId } from './unidades_curriculares';

export interface disciplinasAttributes {
  ID: number;
  ID_Curso: number;
  ID_UC: number;
  Semestre: number;
  AddedAT: Date;
}

export type disciplinasPk = "ID";
export type disciplinasId = disciplinas[disciplinasPk];
export type disciplinasOptionalAttributes = "ID" | "AddedAT";
export type disciplinasCreationAttributes = Optional<disciplinasAttributes, disciplinasOptionalAttributes>;

export class disciplinas extends Model<disciplinasAttributes, disciplinasCreationAttributes> implements disciplinasAttributes {
  ID!: number;
  ID_Curso!: number;
  ID_UC!: number;
  Semestre!: number;
  AddedAT!: Date;

  // disciplinas belongsTo cursos via ID_Curso
  ID_Curso_curso!: cursos;
  getID_Curso_curso!: Sequelize.BelongsToGetAssociationMixin<cursos>;
  setID_Curso_curso!: Sequelize.BelongsToSetAssociationMixin<cursos, cursosId>;
  createID_Curso_curso!: Sequelize.BelongsToCreateAssociationMixin<cursos>;
  // disciplinas hasMany notas via ID_Disciplina
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
  // disciplinas belongsTo unidades_curriculares via ID_UC
  ID_UC_unidades_curriculare!: unidades_curriculares;
  getID_UC_unidades_curriculare!: Sequelize.BelongsToGetAssociationMixin<unidades_curriculares>;
  setID_UC_unidades_curriculare!: Sequelize.BelongsToSetAssociationMixin<unidades_curriculares, unidades_curricularesId>;
  createID_UC_unidades_curriculare!: Sequelize.BelongsToCreateAssociationMixin<unidades_curriculares>;

  static initModel(sequelize: Sequelize.Sequelize): typeof disciplinas {
    return disciplinas.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    ID_Curso: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'cursos',
        key: 'ID'
      }
    },
    ID_UC: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'unidades_curriculares',
        key: 'ID'
      }
    },
    Semestre: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false
    },
    AddedAT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'disciplinas',
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
        name: "ID_Curso",
        using: "BTREE",
        fields: [
          { name: "ID_Curso" },
        ]
      },
      {
        name: "ID_UC",
        using: "BTREE",
        fields: [
          { name: "ID_UC" },
        ]
      },
    ]
  });
  }
}
