import type { ApiResponse, ApiResponseNotPagination, Pagination } from "src/types/api"
import { useApi } from "./useApi"
import type { Patient, PatientsFilters } from "src/types/Patient"
import { ref } from "vue"

export function usePatient() {
    const patients = ref<Patient[]>([])
    const pagination = ref<Pagination<Patient> | null>(null)
    const loading = ref(false)
    const { get, post, put, del } = useApi()

    const endpoint = '/patients'

    const list = (page = 1, filters: PatientsFilters) => {

        const params = new URLSearchParams()

        params.set('page', String(page))

        if (filters.name) {
            params.set('name', filters.name)
        }

        if (filters.phone) {
            params.set('phone', filters.phone)
        }

        if (filters.cpf) {
            params.set('cpf', filters.cpf)
        }

        if (filters.birth_date) {
            params.set('birth_date', filters.birth_date)
        }

        return get<ApiResponse<Pagination<Patient>>>(`${endpoint}?${params.toString()}`)
    }

    const find = (id: number) => 
        get<ApiResponse<Patient>>(`${endpoint}/${id}`)

    const create = (data: Partial<Patient>) => 
        post<ApiResponse<Patient>, Partial<Patient>>(endpoint, data)

    const update = (id: number, data: Partial<Patient>) =>
        put<ApiResponse<Patient>, Partial<Patient>>(`${endpoint}/${id}`, data)

    const remove = (id: number) => 
            del<void>(`${endpoint}/${id}`)

    const fetchPatients = async (page = 1, filters: PatientsFilters) => {

        loading.value = true
        try {
            const response = await list(page, filters)

            patients.value = response.data.data
            pagination.value = response.data                
        } finally{
            loading.value = false
        }
        
    }

    const listAllPatients = (name: string = '') => {
        return get<ApiResponseNotPagination<Patient>>(`${endpoint}?nao_paginar=true&name=${name}`)
    }

    const fetchAllPatients = async (name: string = '') => {
        const response = await listAllPatients(name)
        patients.value = response.data
    }

    return {
        find,
        create,
        update,
        remove,
        fetchPatients,
        fetchAllPatients,
        patients,
        pagination,
        loading
    }
}