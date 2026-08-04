<script setup lang="ts">
import { useMedicalSessions } from 'src/composables/useMedicalSessions';
import { formatarData } from 'src/utils/dateUtils';
import { computed, onMounted, ref } from 'vue';


const { medical_sessions, fetchMedicalSessions, loading } = useMedicalSessions()
const data_selecionada = ref(new Date)

onMounted(async () => {
    const data = formatarData(data_selecionada.value, 'YYYY-MM-DD')
    await fetchMedicalSessions(data)
})

const horarios = Array.from(
  { length: 11 },
  (_, i) => `${String(i + 8).padStart(2, '0')}:00:00`
)

const sessoesPorHorario = computed(() => {
  return Object.fromEntries(
    medical_sessions.value.map(session => [
      session.session_time.substring(0, 8),
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

                <q-item-section
                    v-else
                    class="text-grey"
                >
                    Horário livre
                </q-item-section>
            </q-item>
        </q-list>

    </q-page>
</template>