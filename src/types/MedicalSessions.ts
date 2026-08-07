import type { Patient } from "./Patient"

export type StatusMedicalSession =
  | 'scheduled'
  | 'done'
  | 'cancelled'

export const medicalSessionStatus = {
  scheduled: {
    label: 'Agendado',
    color: 'primary',
    icon: 'event'
  },
  done: {
    label: 'Concluído',
    color: 'positive',
    icon: 'check_circle'
  },
  cancelled: {
    label: 'Cancelado',
    color: 'negative',
    icon: 'cancel'
  }
} as const

export interface MedicalSessions{
    id?: number,
    patient_id: number,
    session_date: string,
    session_time: string,
    price?: number | undefined,
    status?: StatusMedicalSession,
    paid?: boolean,
    paid_at?: string,
    notes?: string
    data_formatada?: string
    patient?: Patient
}