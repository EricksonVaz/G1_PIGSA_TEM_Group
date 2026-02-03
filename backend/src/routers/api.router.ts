import { Router } from "express";
import { UnidadesCurricularesController } from "../controllers/UnidadesCurricularesController";
import { authenticateToken } from "../middleware/authenticateToken";

export const apiRouter = Router();

/** Gestão Unidade Curriculares */
apiRouter.get("/unidades-list", UnidadesCurricularesController.listAll);
apiRouter.post("/unidades", UnidadesCurricularesController.adicionar);
apiRouter.put("/unidades/:id", UnidadesCurricularesController.editar);
apiRouter.delete("/unidades/:id", UnidadesCurricularesController.remover);

/** Gestão Cursos */
// apiRouter.get("/cursos-list", LivroController.adicionar);
// apiRouter.post("/cursos", LivroController.adicionar);
// apiRouter.put("/cursos/:id", LivroController.editar);
// apiRouter.delete("/cursos/:id", LivroController.remover);
// apiRouter.post("/cursos/:id/add-disciplinas", LivroController.disponibilidade);
// apiRouter.delete("/cursos/:id/remove-disciplinas", LivroController.disponibilidade);

/** Gestão Alunos */
// apiRouter.post("/alunos/create-acesss", LivroController.adicionar);
// apiRouter.post("/alunos/add-contacto-info", LivroController.adicionar);

/** Gestão Matriculas */
// apiRouter.get("/matriculas-list", LivroController.adicionar);
// apiRouter.post("/matriculas/register-aluno", LivroController.adicionar);
// apiRouter.delete("/matriculas/remove-aluno/:id", LivroController.remover);
// apiRouter.post("/matriculas/add-aluno-semestre", LivroController.adicionar);
// apiRouter.delete("/matriculas/remove-aluno-semestre/:id", LivroController.adicionar);

/** Publicar Notas */
// apiRouter.get("/notas/list-matriculas", EmprestimoController.registar);
// apiRouter.post("/notas/publicar", EmprestimoController.registar);

/** Autenticação */
// apiRouter.post("/auth/login", EmprestimoController.registar);

// apiRouter.use(authenticateToken);

// apiRouter.put("/user/update-contact-info", LivroController.adicionar);
// apiRouter.put("/user/update-password", LivroController.adicionar);

// apiRouter.get("/user/list-cursos", LivroController.adicionar);
// apiRouter.get("/user/list-notas/:curso", LivroController.adicionar);
// apiRouter.get("/user/list-proprinas/:curso", LivroController.adicionar);

// apiRouter.post("/user/pagamentos/download-recibo", LivroController.adicionar);

export default apiRouter;
