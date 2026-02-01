import { Request, Response, NextFunction } from "express";
import { sequelize } from "../db/sequelize";

export class EmprestimoController {
  static async registar(req: Request, res: Response, next: NextFunction) {
    try {
      const { Numero, ISBN, Dias } = req.body;
      const [rows]: any = await sequelize.query(
        "CALL sp_emprestimo_registar(:pNumero, :pISBN, :pDias);",
        { replacements: { pNumero: Number(Numero), pISBN: ISBN, pDias: Dias ?? 14 } }
      );

      return res.status(201).json({ message: "Empréstimo registado", retorno: rows ?? null });
    } catch (err) { next(err); }
  }

  static async devolver(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await sequelize.query(
        "CALL sp_emprestimo_devolver(:pEmprestimoID);",
        { replacements: { pEmprestimoID: id } }
      );
      return res.json({ message: "Empréstimo devolvido", id });
    } catch (err) { next(err); }
  }
}
