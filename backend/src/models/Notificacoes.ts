import { sequelize } from "../db/sequelize";
import { notificacoes, notificacoesAttributes } from "./data/notificacoes";

export interface ICreateNotificacao {
  Metodo: string;
  RequestData: string;
  ResponseData: string;
  SentTo: number;
}

export class Notificacoes extends notificacoes {
  static modelInstance() {
    let model = notificacoes.initModel(sequelize);
    return model;
  }

  static async createNew(objToSave: ICreateNotificacao) {
    const { Metodo, RequestData, ResponseData, SentTo } = objToSave;

    let resourceCreate = await this.modelInstance().create({
      Metodo,
      RequestData,
      ResponseData,
      SentTo,
    });

    await resourceCreate.reload();
    return resourceCreate as notificacoesAttributes;
  }
}
