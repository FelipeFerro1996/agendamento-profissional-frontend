import type { MedicalSessions } from "src/types/MedicalSessions";
import { ref } from "vue";
import { useApi } from "./useApi";
import type { ApiResponseNotPagination } from "src/types/api";

export function useMedicalSessions(){

    const medical_sessions = ref<MedicalSessions[]>([])
    const loading = ref(false)

    const { get } = useApi()
    
    const endpoint = '/medical_sessions'

    const list = () => {
        return get<ApiResponseNotPagination<MedicalSessions>>(`${endpoint}`)
    }

    const fetchMedicalSessions = async () => {
        loading.value = true

        try {
            
            const response = await list()
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