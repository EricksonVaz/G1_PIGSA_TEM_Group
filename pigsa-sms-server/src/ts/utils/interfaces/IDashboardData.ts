export interface IDashboardData {
  totalClaimsByConcelho: ITotalClaimsByConcelho[]
  totalClaimsByGender: ITotalClaimsByGender[]
  totalClaimsByCategories: ITotalClaimsByCategory[]
  totalClaimsByState: ITotalClaimsByState[]
}

export interface ITotalClaimsByConcelho {
  concelho: string
  total: number
}

export interface ITotalClaimsByGender {
  Sexo: string
  total: number
}

export interface ITotalClaimsByCategory {
  categoria: string
  total: number
}

export interface ITotalClaimsByState {
  "Em andamento": number
  "Encerrado": number
}