import type { Patient } from "./Patient"

type statusMedicalSession = "scheduled" | "done" | "cancelled"

export interface MedicalSessions{
    id: number,
    patient_id: number,
    session_date: string,
    session_time: string,
    price?: number,
    status?: statusMedicalSession,
    paid?: boolean,
    paid_at?: string,
    notes?: Text
    data_formatada?: string
    patient?: Patient
}