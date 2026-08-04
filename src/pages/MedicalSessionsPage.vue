<script setup lang="ts">
import { date } from 'quasar';
import { useMedicalSessions } from 'src/composables/useMedicalSessions';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const { medical_sessions, fetchMedicalSessions, loading } = useMedicalSessions()
const data_selecionada = ref(
    (route.query.session_date as string) ?? date.formatDate(new Date, 'YYYY-MM-DD')
)

onMounted(async () => {
    await carregaAgenda()
})

async function carregaAgenda(){
    await fetchMedicalSessions(data_selecionada.value)
}

watch(data_selecionada, async () => {
    await carregaAgenda()
})

const horarios = Array.from(
  { length: 11 },
  (_, i) => `${String(i + 8).padStart(2, '0')}:00`
)

const sessoesPorHorario = computed(() => {
  return Object.fromEntries(
    medical_sessions.value.map(session => [
      session.session_time.substring(0, 5),
      session
    ])
  )
})

const agenda = computed(() => {
  return horarios.map(horario => ({
    horario,
    agendamento: sessoesPorHorario.value[horario] ?? null,
    ocupado: !!sessoesPorHorario.value[horario]
  }))
})

const novoAgendamento = (item: string) => {
    void router.push({
        name: 'medical-session-create',
        query: {
            date: data_selecionada.value,
            time: item
        }
    })
}

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

        <div class="row items-center justify-between q-mb-md">
            <q-input
                v-model="data_selecionada"
                type="date"
                outlined
                label="Data"
            />
        </div>

        <q-list bordered separator v-if="!loading">
            <q-item
                v-for="item in agenda"
                :key="item.horario"
            >
                <q-item-section avatar>
                    <q-badge
                        color="primary"
                        :label="item.horario"
                    />
                </q-item-section>

                <q-item-section v-if="item.ocupado">
                    <q-item-label>
                        {{ item.agendamento?.patient?.name ?? '' }}
                    </q-item-label>

                    <q-item-label caption>
                        {{ item.agendamento?.patient?.phone ?? '' }}
                    </q-item-label>
                </q-item-section>

                <q-item
                    v-else
                    clickable 
                    v-ripple
                    @click="novoAgendamento(item.horario)"
                >
                    <q-item-section
                        class="text-grey"
                    >
                        Horário livre
                    </q-item-section>
                </q-item>
                
            </q-item>
        </q-list>

    </q-page>
</template>