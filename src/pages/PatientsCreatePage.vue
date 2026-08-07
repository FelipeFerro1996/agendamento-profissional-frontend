<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePatient } from 'src/composables/usePatient';
import { useRoute, useRouter } from 'vue-router';
import { type Patient } from 'src/types/Patient';
import PatientForm from 'src/components/PatientForm.vue';
import axios from 'axios';
import { type ValidationErrorResponse } from 'src/composables/useApi';
import { useQuasar } from 'quasar';
import type { ApiResponse } from 'src/types/api';

const router = useRouter()
const route = useRoute()
const { create, update, find } = usePatient()
const errors = ref<Record<string, string[]>>({})
const $q = useQuasar()

const loading = ref(false)
const editing = computed(() => !!route.params.id)

const patient = ref<Partial<Patient>>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birth_date: ''
})

onMounted(async () => {
    loading.value = true

    try {
        const patientReturn = await find(Number(route.params.id))
        patient.value = patientReturn.data      
    } finally {
        loading.value = false
    }
})

const save = async () => {

    loading.value = true

    try {
        
        const payload = {
            ...patient.value,
            ...(patient.value.phone && {
                phone: patient.value.phone.replace(/\D/g, '')
            }),
            ...(patient.value.cpf && {
                cpf: patient.value.cpf.replace(/\D/g, '')
            })
        }

        let response: ApiResponse<Patient>

        if(route.params.id){
            response = await update(Number(route.params.id), payload)
        }else{
            response = await create(payload)
        }

        void router.push(`/patients/${response.data.id}`)
        $q.notify({
            type:'positive',
            message: `Paciente "${payload.name}" cadastrado com sucesso`
        })
    } catch (error: unknown) {
        if (axios.isAxiosError<ValidationErrorResponse>(error)) {
            errors.value = error.response?.data.errors ?? {}
        }
    } finally {
        loading.value = false
    }

}

</script>

<template>
    <q-page class="q-pa-md">
        <div class="text-h5 q-md-lg">
            <span v-if="editing">Editando Paciente {{ patient.name ?? '' }}</span>
            <span v-else>Novo paciente</span>
        </div>

        <PatientForm
            v-model="patient"
            :loading="loading"
            @submit="save"
            :errors="errors"
        />

    </q-page>
</template>