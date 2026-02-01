export interface ICSU_DR_AGREGADO {
  ID: number
  Concelho: string
  NomeRepresentante: string
  NIA: string
  EnergiaElectricaM1: number
  EnergiaElectricaM2: number
  EnergiaElectricaM3: number
  AguaM1: number
  AguaM2: number
  AguaM3: number
  GasCarvaoLenha: number
  Habitacao: number
  AlimHigiLimpeza: number
  Educacao: number
  Saude: number
  TransporteM: number
  DeclaracaoVeracidade: string
  Parcer: string
  CriationDate: string
  CreatedBy: string
  UpdateDate: string
  UpdatedBy: string
  Status: number
  membros: ICSU_DR_MEMBRO[]
}

export interface ICSU_DR_MEMBRO {
  ID: number
  AggID: number
  Nome: string
  Age: string
  NIF: string
  OcupacaoAtual: string
  Vinculo: string
  OutroVinculo: string
  RemuneravelUltimoMes: number
  MontanteRecebido: number
  RemuneravelUltimo3Mes: number
  QtMesesTrabalho: number
  TotalRecebidoPeriodo: number
  AjudaFamiNaoFamiPais: number
  AjudaFamiNaoFamiEst: number
  AponsetReforma: number
  PensaoSocial: number
  PensaoInvalidez: number
  PensaoRefVel: number
  AbonoFami: number
  PensaoAlim: number
  BolsaSubEdu: number
  AlugerEspacos: number
  AlugerVeiculoS: number
  ExplicacoesFormacoes: number
  OutroRendimento: string
  ValorOutroRendimento: number
}