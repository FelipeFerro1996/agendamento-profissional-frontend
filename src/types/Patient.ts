export interface Patient {
  id: number
  name: string
  email: string
  phone?: string
  cpf?: string
  birth_date?: string
  created_at?: string
  updated_at?: string
}

export interface PatientsFilters {
  name?: string
  birth_date?: string
  phone?: string
  cpf?: string
}