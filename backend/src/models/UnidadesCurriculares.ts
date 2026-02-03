import { randomUUID } from "crypto";
import { sequelize } from "../db/sequelize";
import { unidades_curriculares, unidades_curricularesAttributes } from "./data/unidades_curriculares";

export interface ICreateUnidadesCurriculares{
  Nome: string;
  Faculdade: string;
}

export class UnidadesCurriculares extends unidades_curriculares{

  static modelInstance(){
        let model = unidades_curriculares.initModel(sequelize);

        return model;
    }
 
  static async getAll(){
    // const [rows] = await sequelize.query(
    //   "CALL sp_aluno_adicionar(:pNome, :pEmail);",
    //   { replacements: { pNome: Nome, pEmail: email } }
    // );


    const [rows] = await sequelize.query(
      "SELECT UUID AS ID, Nome, Faculdade FROM `unidades_curriculares` WHERE status = 1 ORDER BY CreationDate DESC;"
    );

    return rows as unidades_curricularesAttributes[];
  }


  static async findByNomeAndFaculdade(nome:string,faculdade:string){
    // const [rows] = await sequelize.query(
    //   "CALL sp_aluno_adicionar(:pNome, :pEmail);",
    //   { replacements: { pNome: Nome, pEmail: email } }
    // );


    const [rows] = await sequelize.query(
      "SELECT UUID AS ID, Nome, Faculdade FROM `unidades_curriculares` WHERE status = 1 AND Nome = :nome AND Faculdade = :faculdade;",
      { replacements: { nome: nome, faculdade: faculdade } }
    );

    return rows as unidades_curricularesAttributes[];
  }

  static async findByUUID(uuid:string){
  
    const [rows] = await sequelize.query(
      "SELECT UUID AS ID, Nome, Faculdade FROM `unidades_curriculares` WHERE status = 1 AND UUID = :uuid;",
      { replacements: { uuid: uuid} }
    );

    return rows as unidades_curricularesAttributes[];
  }

  static async existeOtherUCWithSameInfo(uuid:string,nome:string,faculdade:string){
  
    const [rows] = await sequelize.query(
      "SELECT UUID AS ID, Nome, Faculdade FROM `unidades_curriculares` WHERE status = 1 AND Nome = :nome AND Faculdade = :faculdade AND UUID <> :uuid;",
      { replacements: { nome: nome, faculdade: faculdade, uuid: uuid } }
    );

    return rows.length>0;
  }

  static async createNew(objToSave:ICreateUnidadesCurriculares){
        const {
          Nome,
          Faculdade,
        } = objToSave;

        let UUID = randomUUID();

        let resourceCreate = await this.modelInstance().create({
          UUID,
          Nome,
          Faculdade,
          status:1
        });

        await resourceCreate.reload();


        return resourceCreate;
    }
}