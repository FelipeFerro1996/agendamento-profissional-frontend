<script setup lang="ts">
import { date, useQuasar } from 'quasar';
import { useMedicalSessions } from 'src/composables/useMedicalSessions';
import { medicalSessionStatus, type StatusMedicalSession } from 'src/types/MedicalSessions';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { QTableColumn } from 'quasar'
import axios from 'axios';
import type { ValidationErrorResponse } from 'src/composables/useApi';

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const { medical_sessions, fetchMedicalSessions, loading, update } = useMedicalSessions()
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

const getStatusLabel = (status?: keyof typeof medicalSessionStatus) => {
    return status 
        ? medicalSessionStatus[status].label
        : "Não informado"
}

const getStatusColor = (status?: keyof typeof medicalSessionStatus) => {
    return status
        ? medicalSessionStatus[status].color
        : 'grey'
}

const columns: QTableColumn[] = [
  {
    name: 'horario',
    label: 'Horário',
    field: 'horario',
    align: 'left',
    sortable: true
  },
  {
    name: 'paciente',
    label: 'Paciente',
    field: row => row.agendamento?.patient?.name ?? '',
    align: 'left'
  },
  {
    name: 'status',
    label: 'Status',
    field: row => row.agendamento?.status ?? '',
    align: 'center'
  },
  {
    name: 'preco',
    label: 'Valor',
    field: row => row.agendamento?.price ?? '',
    align: 'right'
  },
  {
    name: 'pago',
    label: 'Pago',
    field: row => row.agendamento?.paid ?? '',
    align: 'right'
  },
  {
    name: 'acoes',
    label: '',
    field: 'acoes',
    align: 'right'
  }
]

async function updateStatus(id: number, status: StatusMedicalSession, descricaoStatus: string){
    loading.value = true

    try {
        await update(id, {
            status
        })
        await fetchMedicalSessions(data_selecionada.value)
        $q.notify({
            type: 'positive',
            message: `Status atualizado para ${descricaoStatus}`
        })
    } catch (error: unknown) {

        if(axios.isAxiosError<ValidationErrorResponse>(error)){
            $q.notify({
                type: 'negative',
                message: error.response?.data.message ?? 'Erro ao atualizar o status do agendamento'
            })  
        }else{
            $q.notify({
                type: 'negative',
                message: 'Erro ao atualizar o status do agendamento'
            })    
        }


    }finally {
        loading.value = false
    }
}

const confirmUpdateStatusAgendamento = (id: number, status: StatusMedicalSession) => {

    const descricaoStatus = getStatusLabel(status)

    $q.dialog({
        title: 'Alterar status',
        message: `Deseja realmente alterar o status do agendamento para ${descricaoStatus}?`,
        cancel: true,
        persistent: true,
    }).onOk(() => {
        void updateStatus(id, status, descricaoStatus)
    })

}

async function updatePagamento(id: number, paid: boolean){
    loading.value = true

    const descricao = paid ? 'Marcada' : 'Desmarcado' 

    try {
        await update(id, {
            paid
        })
        await fetchMedicalSessions(data_selecionada.value)
        $q.notify({
            type: 'positive',
            message: `${descricao} como pago o agendamento`
        })
    } catch (error: unknown) {

        if(axios.isAxiosError<ValidationErrorResponse>(error)){
            $q.notify({
                type: 'negative',
                message: error.response?.data.message ?? 'Erro ao atualizar o agendamento'
            })  
        }else{
            $q.notify({
                type: 'negative',
                message: 'Erro ao atualizar o agendamento'
            })    
        }


    }finally {
        loading.value = false
    }
}

const alteraPagamaneto = (id:number, pago: boolean) => {
    const descricao = pago ? "marcar" : "desmarcar"

    $q.dialog({
        title: "Alterar pagamento",
        message: `Deseja ${descricao} como pago o agendamento`,
        cancel: true,
        persistent: true
    }).onOk(() => {
        void updatePagamento(id, pago)
    })

}

</script>

<template>
    <q-page class="q-pa-md">
        
        <div class="row items-center justify-between q-mb-md">
            <div class="text-h5">
                Agendamentos
            </div>

            <q-input
                v-model="data_selecionada"
                type="date"
                outlined
                dense
                label="Data"
            />

        </div>

        <q-table
            :rows="agenda"
            :columns="columns"
            row-key="horario"
            flat
            bordered
            hide-pagination
            :rows-per-page-options="[0]"
            class="agenda-table"
            v-if="!loading"
        >

            <!-- Horário -->
            <template #body-cell-horario="props">
                <q-td :props="props">
                    <q-badge
                        color="primary"
                        rounded
                    >
                        {{ props.row.horario }}
                    </q-badge>
                </q-td>
            </template>

            <!-- Paciente -->
            <template #body-cell-paciente="props">
                <q-td :props="props">

                <div v-if="props.row.ocupado">

                    <div class="text-weight-medium">
                    {{ props.row.agendamento.patient.name }}
                    </div>

                    <div class="text-caption text-grey-7">
                    {{ props.row.agendamento.patient.phone }}
                    </div>

                </div>

                <div
                    v-else
                    class="text-grey"
                >
                    <q-btn
                        flat
                        round
                        dense
                        color="primary"
                        icon="add"
                        @click="novoAgendamento(props.row.horario)"
                    >
                        <q-tooltip>Novo agendamento</q-tooltip>
                    </q-btn>
                </div>

                </q-td>
            </template>

            <!-- Status -->
            <template #body-cell-status="props">
                <q-td :props="props">

                <q-badge
                    v-if="props.row.ocupado"
                    rounded
                    :color="getStatusColor(props.row.agendamento.status)"
                >
                    {{ getStatusLabel(props.row.agendamento.status) }}
                </q-badge>

                </q-td>
            </template>

            <!-- Valor -->
            <template #body-cell-preco="props">
                <q-td :props="props">

                <span v-if="props.row.ocupado">
                    R$ {{ Number(props.row.agendamento.price).toFixed(2) }}
                </span>

                <span
                    v-else
                    class="text-grey"
                >
                    —
                </span>

                </q-td>
            </template>

            <!-- Pago -->
            <template #body-cell-pago="props">
                <q-td :props="props">
                    <q-icon
                        v-if="props.row.agendamento?.paid" 
                        name="check" 
                    />
                </q-td>
            </template>

            <!-- Ações -->
            <template #body-cell-acoes="props">
                <q-td
                :props="props"
                class="text-right"
                >

                <div v-if="props.row.ocupado" class="row justify-end no-wrap q-gutter-xs">

                    <q-btn
                        v-if="!props.row.agendamento?.paid"
                        flat
                        round
                        dense
                        color="primary"
                        icon="attach_money"
                        @click="alteraPagamaneto(props.row.agendamento.id, !props.row.agendamento.paid)"
                    >
                        <q-tooltip>Marcom como pago</q-tooltip>
                    </q-btn>

                    <q-btn
                        flat
                        round
                        dense
                        color="primary"
                        icon="edit"
                        :to="`/medical_sessions/${props.row.agendamento.id}`"
                    >
                        <q-tooltip>Editar</q-tooltip>
                    </q-btn>

                    <q-btn
                        v-if="props.row.agendamento.status === 'scheduled'"
                        flat
                        round
                        dense
                        color="positive"
                        icon="check"
                        @click="confirmUpdateStatusAgendamento(props.row.agendamento.id, 'done')"
                    >
                        <q-tooltip>Concluir atendimento</q-tooltip>
                    </q-btn>

                    <q-btn
                        v-if="props.row.agendamento.status !== 'done'"
                        flat
                        round
                        dense
                        color="negative"
                        icon="close"
                        @click="confirmUpdateStatusAgendamento(props.row.agendamento.id, 'cancelled')"
                    >
                        <q-tooltip>Cancelar atendimento</q-tooltip>
                    </q-btn>

                </div>

                </q-td>
            </template>

        </q-table>

    </q-page>
</template>