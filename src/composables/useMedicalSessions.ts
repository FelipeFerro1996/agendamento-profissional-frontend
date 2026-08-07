import type { MedicalSessions } from "src/types/MedicalSessions";
import { ref } from "vue";
import { useApi } from "./useApi";
import type { ApiResponse, ApiResponseNotPagination } from "src/types/api";

export function useMedicalSessions(){

    const medical_sessions = ref<MedicalSessions[]>([])
    const loading = ref(false)

    const { get, post, put } = useApi()
    
    const endpoint = '/medical_sessions'

    const list = (session_date: string = '') =>
        get<ApiResponseNotPagination<MedicalSessions>>(`${endpoint}?session_date=${session_date}&status_not_in=cancelled`)

    const create = (data: Partial<MedicalSessions>) =>
        post<MedicalSessions, Partial<MedicalSessions>>(endpoint, data)

    const fetchMedicalSessions = async (session_date: string = '') => {
        loading.value = true

        try {
            
            const response = await list(session_date)
            medical_sessions.value = response.data

            console.log(medical_sessions)

        } finally {
            loading.value = false
        }
    }

    const update = (id: number, data: Partial<MedicalSessions>) =>
        put<MedicalSessions, Partial<MedicalSessions>>(`${endpoint}/${id}`, data)

    const find = (id: number) => 
        get<ApiResponse<MedicalSessions>>(`${endpoint}/${id}`)

    return {
        fetchMedicalSessions,
        create,
        update,
        find,
        medical_sessions,
        loading
    }

}