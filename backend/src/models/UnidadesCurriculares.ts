import { randomUUID } from "crypto";
import { sequelize } from "../db/sequelize";
import { unidades_curriculares, unidades_curricularesAttributes } from "./data/unidades_curriculares";

export interface ICreateUpdateUnidadesCurriculares{
  UUID?:string;
  Nome: string;
  Faculdade: string;
}

export class UnidadesCurriculares extends unidades_curriculares{

  static modelInstance(){
        let model = unidades_curriculares.initModel(sequelize);

        return model;
    }
 
  static async getAll(){

    const [rows] = await sequelize.query(
      "SELECT UUID AS ID, Nome, Faculdade FROM `unidades_curriculares` WHERE status = 1 ORDER BY CreationDate DESC;"
    );

    return rows as unidades_curricularesAttributes[];
  }


  static async findByNomeAndFaculdade(nome:string,faculdade:string){
  
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

  static async findInternalByUUID(uuid:string){
  
    const [rows] = await sequelize.query(
      "SELECT ID, UUID, Nome, Faculdade FROM `unidades_curriculares` WHERE status = 1 AND UUID = :uuid;",
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

  static async createNew(objToSave:ICreateUpdateUnidadesCurriculares){
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

  static async updateUC(objToSave:ICreateUpdateUnidadesCurriculares){
    const {
      UUID,
      Nome,
      Faculdade,
    } = objToSave;

    let resourceUpdated = await this.modelInstance().update({
      Nome,
      Faculdade
    },
      {
        where :{
          UUID
        }
      }
    );


    return resourceUpdated[0];
  }

  static async deleteUC(UUID:string){

    let ucExist = await UnidadesCurriculares.findByUUID(UUID);
    if(ucExist.length<=0){
      return "not-found";
    }

    let resourceUpdated = await this.modelInstance().update(
      {
        status:0
      },
      {
        where :{
          UUID
        }
      }
    );


    return resourceUpdated[0];
  }
}
