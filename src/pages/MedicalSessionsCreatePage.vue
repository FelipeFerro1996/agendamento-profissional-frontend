<script setup lang="ts">
import axios from 'axios';
import { useQuasar } from 'quasar';
import MedicalSessionForm from 'src/components/MedicalSessionForm.vue';
import type { ValidationErrorResponse } from 'src/composables/useApi';
import { useMedicalSessions } from 'src/composables/useMedicalSessions';
import type { MedicalSessions } from 'src/types/MedicalSessions';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const errors = ref<Record<string, string[]>>({})
const { create, find, update } = useMedicalSessions()
const router = useRouter()
const $q = useQuasar();

const editing = computed(() => !!route.params.id)

const medical_session = ref<Partial<MedicalSessions>>({
    session_date: route.query.date as string,
    session_time: route.query.time as string
})

const save = async () => {
    
    loading.value = true

    try {

        if(route.params.id){
            await update(Number(route.params.id), medical_session.value)
        }else{
            await create(medical_session.value)
        }

        void router.push({
            name: 'medical-sessions-list',
            query: {
                session_date: medical_session.value.session_date
            }
        })
        $q.notify({
            type: "positive",
            message: "Consulta salva com sucesso!"
        })
    } catch (error: unknown) {
        if(axios.isAxiosError<ValidationErrorResponse>(error)){
            errors.value = error.response?.data.errors ?? {}
        }
    }finally {
        loading.value = false
    }
}

const loading = ref(false)

onMounted(async () => {

    loading.value = true

    try{
        if(route.params.id){
            const response = await find(Number(route.params.id))
            medical_session.value = response.data
        }
    }finally{
        loading.value = false
    }

})

</script>

<template>
    <q-page class="q-pa-md">
        <div class="text-h5 q-md-lg">
            <span v-if="route.params.id">Alteração agendamento {{ medical_session.patient?.name ?? '' }} </span>
            <span v-else>Novo Agendamento</span>
        </div>

        <MedicalSessionForm
            v-model="medical_session"
            :loading="loading"
            :errors="errors"
            :patientSelect="medical_session.patient"
            :editing="editing"
            @submit="save"
        />

    </q-page>
</template>