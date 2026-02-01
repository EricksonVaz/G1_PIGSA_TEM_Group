export interface IEmprestimo {
  ID?: number;
  Numero: number; // aluno
  ISBN: string;   // livro
  Data_Emp?: string;
  Data_Ent?: string;
  Status?: "ATIVO" | "DEVOLVIDO";
}
