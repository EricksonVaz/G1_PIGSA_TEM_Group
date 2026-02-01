import { Request, Response, NextFunction } from "express";
import { sequelize } from "../db/sequelize";

export class AlunoController {
  static async adicionar(req: Request, res: Response, next: NextFunction) {
    try {
      const { Nome, email } = req.body;
      const [rows] = await sequelize.query(
        "CALL sp_aluno_adicionar(:pNome, :pEmail);",
        { replacements: { pNome: Nome, pEmail: email } }
      );
      // MariaDB pode retornar array vazio; garantimos 200 com eco do input
      return res.status(201).json({ message: "Aluno criado", data: { Nome, email, retorno: rows } });
    } catch (err) { next(err); }
  }

  static async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const numero = Number(req.params.numero);
      const { Nome, email } = req.body;

      await sequelize.query(
        "CALL sp_aluno_editar(:pNumero, :pNome, :pEmail);",
        { replacements: { pNumero: numero, pNome: Nome, pEmail: email } }
      );

      return res.json({ message: "Aluno atualizado", numero });
    } catch (err) { next(err); }
  }

  static async remover(req: Request, res: Response, next: NextFunction) {
    try {
      const numero = Number(req.params.numero);

      await sequelize.query(
        "CALL sp_aluno_remover(:pNumero);",
        { replacements: { pNumero: numero } }
      );

      return res.json({ message: "Aluno removido", numero });
    } catch (err) { next(err); }
  }
}
