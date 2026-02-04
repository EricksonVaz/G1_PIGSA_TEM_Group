import { Router } from "express";
import { UnidadesCurricularesController } from "../controllers/UnidadesCurricularesController";
import { CursosController } from "../controllers/CursosController";
import { AlunosController } from "../controllers/AlunosController";
import { authenticateToken } from "../middleware/authenticateToken";

export const apiRouter = Router();

/** Gestão Unidade Curriculares */
apiRouter.get("/unidades-list", UnidadesCurricularesController.listAll);
apiRouter.post("/unidades", UnidadesCurricularesController.adicionar);
apiRouter.put("/unidades/:uuid", UnidadesCurricularesController.editar);
apiRouter.delete("/unidades/:uuid", UnidadesCurricularesController.remover);

/** Gestão Cursos */
apiRouter.get("/cursos-list", CursosController.listAll);
apiRouter.post("/cursos", CursosController.adicionar);
apiRouter.put("/cursos/:uuid", CursosController.editar);
apiRouter.delete("/cursos/:uuid", CursosController.remover);
apiRouter.post("/cursos/:uuid/add-disciplinas", CursosController.adicionarUCEmCursos);
apiRouter.delete("/cursos/:uuid/remove-disciplinas", CursosController.removerUCEmCursos);

/** Gestão Alunos */
apiRouter.post("/alunos/register-info", AlunosController.registerInfo);
apiRouter.delete("/alunos/:uuid", AlunosController.removeAluno);
apiRouter.put("/alunos/create-access/:uuid", AlunosController.createAccess);
apiRouter.put("/alunos/add-contacto-info/:uuid", AlunosController.addContactInfo);
/**FIM Gestão Alunos */

/** Gestão Matriculas */
// apiRouter.get("/matriculas-list", LivroController.adicionar);
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
