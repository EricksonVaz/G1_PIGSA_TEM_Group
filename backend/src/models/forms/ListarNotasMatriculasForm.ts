import { Notas } from "../Notas";

export class ListarNotasMatriculasForm {
  private filtroCurso: string = "";

  constructor(filterCurso: string) {
    this.filtroCurso = (filterCurso ?? "").toString().trim();
  }

  async post() {
    return Notas.listarMatriculas(this.filtroCurso);
  }
}
