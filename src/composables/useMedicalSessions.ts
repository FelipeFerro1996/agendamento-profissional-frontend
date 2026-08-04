import type { MedicalSessions } from "src/types/MedicalSessions";
import { ref } from "vue";
import { useApi } from "./useApi";
import type { ApiResponseNotPagination } from "src/types/api";

export function useMedicalSessions(){

    const medical_sessions = ref<MedicalSessions[]>([])
    const loading = ref(false)

    const { get } = useApi()
    
    const endpoint = '/medical_sessions'

    const list = (session_date: string = '') => {
        return get<ApiResponseNotPagination<MedicalSessions>>(`${endpoint}?session_date=${session_date}`)
    }

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

    return {
        fetchMedicalSessions,
        medical_sessions,
        loading
    }

}