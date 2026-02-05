import { Router } from "express";
import { UnidadesCurricularesController } from "../controllers/UnidadesCurricularesController";
import { CursosController } from "../controllers/CursosController";
import { AlunosController } from "../controllers/AlunosController";
import { MatriculasController } from "../controllers/MatriculasController";
import { NotasController } from "../controllers/NotasController";
import { AuthController } from "../controllers/AuthController";
import { UserController } from "../controllers/UserController";
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
apiRouter.get("/alunos/list-matriculados", AlunosController.allMatriculados);
apiRouter.post("/alunos/register-info", AlunosController.registerInfo);
apiRouter.delete("/alunos/:uuid", AlunosController.removeAluno);
apiRouter.put("/alunos/create-access/:uuid", AlunosController.createAccess);
apiRouter.put("/alunos/add-contacto-info/:uuid", AlunosController.addContactInfo);
/**FIM Gestão Alunos */

/** Gestão Matriculas */
apiRouter.post("/matriculas/add-aluno-semestre", MatriculasController.addAlunosSemestre);
apiRouter.delete("/matriculas/remove-aluno-semestre/:idMatricula", MatriculasController.removeAlunosSemestre);
/**FIM Gestão Matriculas */

/** Publicar Notas */
apiRouter.get("/notas/list-matriculas/:filterCursos", NotasController.listarAlunos);
apiRouter.post("/notas/publicar", NotasController.registar);
apiRouter.delete("/notas/publicar/:idNota", NotasController.apagarNota);
/** FIM Publicar Notas */

/** Autenticação */
apiRouter.post("/auth/login", AuthController.loginAlunos);

apiRouter.use(authenticateToken);

/** Gestão Info User Logado */
apiRouter.put("/user/update-contact-info", UserController.updateContactInfo);
apiRouter.put("/user/update-password", UserController.updatePassword);
apiRouter.get("/user/list-cursos", UserController.listMyCourse);
apiRouter.get("/user/list-notas/:cursouuid", UserController.listMyNotasPublicadosInCourse);
apiRouter.get("/user/list-proprinas/:cursouuid", UserController.listMyProprinasInCourse);
/** FIM Gestão Info User Logado */


// apiRouter.post("/user/pagamentos/download-recibo", LivroController.adicionar);

export default apiRouter;
