import { Request, Response, NextFunction } from "express";
import { sequelize } from "../db/sequelize";

export class LivroController {
  static async adicionar(req: Request, res: Response, next: NextFunction) {
    try {
      const { ISBN, Titulo, Autor } = req.body;
      await sequelize.query(
        "CALL sp_livro_adicionar(:pISBN, :pTitulo, :pAutor);",
        { replacements: { pISBN: ISBN, pTitulo: Titulo, pAutor: Autor } }
      );
      return res.status(201).json({ message: "Livro adicionado", data: { ISBN, Titulo, Autor } });
    } catch (err) { next(err); }
  }

  static async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const { ISBN } = req.params;
      const { Titulo, Autor } = req.body;
      await sequelize.query(
        "CALL sp_livro_editar(:pISBN, :pTitulo, :pAutor);",
        { replacements: { pISBN: ISBN, pTitulo: Titulo, pAutor: Autor } }
      );
      return res.json({ message: "Livro atualizado", ISBN });
    } catch (err) { next(err); }
  }

  static async remover(req: Request, res: Response, next: NextFunction) {
    try {
      const { ISBN } = req.params;
      await sequelize.query(
        "CALL sp_livro_remover(:pISBN);",
        { replacements: { pISBN: ISBN } }
      );
      return res.json({ message: "Livro removido", ISBN });
    } catch (err) { next(err); }
  }

  static async disponibilidade(req: Request, res: Response, next: NextFunction) {
    try {
      const { ISBN } = req.params;
      const [rows]: any = await sequelize.query(
        "CALL sp_livro_disponibilidade(:pISBN);",
        { replacements: { pISBN: ISBN } }
      );
      return res.json({ data: rows ?? null });
    } catch (err) { next(err); }
  }
}
