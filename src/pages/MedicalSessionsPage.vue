<script setup lang="ts">
import { useMedicalSessions } from 'src/composables/useMedicalSessions';
import { onMounted } from 'vue';


const { medical_sessions, fetchMedicalSessions, loading } = useMedicalSessions()

onMounted(async () => {
    await fetchMedicalSessions()
})

</script>

<template>
    <q-page class="q-pa-md">
        
        <div class="row items-center justify-between q-mb-md">
            <div class="text-h5">
                Agendamentos
            </div>

            <q-btn 
                color="primary"
                icon="add"
                label="Novo Agendamento"
            />

        </div>

        <div v-if="loading">Carregando Sessões</div>

        <ul v-else>
            <li v-for="session in medical_sessions" :key="session.id">
                Data {{ session.data_formatada }} | {{ session.session_time }}
            </li>
        </ul>

        <div v-if="!loading && medical_sessions.length === 0">Nenhuma Sessão encontrada</div>

    </q-page>
</template>