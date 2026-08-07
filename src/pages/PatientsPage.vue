<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePatient } from 'src/composables/usePatient'
import { useQuasar, type QTableProps } from 'quasar'
import type { PatientsFilters, Patient } from 'src/types/Patient'

const $q = useQuasar();

const { patients, pagination, loading, fetchPatients, remove } = usePatient()

const tablePagination = ref({
  page:1,
  rowsPerPage:10,
  rowsNumber:0
})

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'phone', label: 'Telefone', field: 'phone', align: 'left' as const },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'left' as const, sortable: false },
]

const onRequest: QTableProps['onRequest'] = ({ pagination }) => {
  void (async () => {
    await fetchPatients(pagination.page, filters.value)

    updatePagination()
  })()
}

onMounted(async () => {
  await fetchPatients(1, filters.value)

  if(pagination.value){
    updatePagination()
  }
})

const confirmDelete = (patient: Patient) => {
  $q.dialog({
    title: 'Excluir paciente',
    message: `Deseja realmente excluir ${patient.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void deletePatient(patient.id)
  })
}

const deletePatient = async (id: number) => {
  loading.value = true

  try{
    await remove(id)
    await fetchPatients(1, filters.value)
    updatePagination()

    $q.notify({
      type: 'positive',
      message: 'Paciente excluído com sucesso!'
    })

  }finally {
    loading.value = false
  }
}

const updatePagination = () => {
  if (!pagination.value) return

  tablePagination.value = {
    page: pagination.value.current_page,
    rowsPerPage: pagination.value.per_page,
    rowsNumber: pagination.value.total,
  }
}

const mostrarFiltros = ref(false)
const filters = ref<PatientsFilters>({
    name: '',
    phone: '',
    cpf: '',
    birth_date: ''
})

const buscar = async () => {
  await fetchPatients(
    1,
    filters.value
  )
}

const limparFiltros = async () => {

    filters.value = {
        name: '',
        cpf: '',
        phone: '',
        birth_date: ''
    }

    await fetchPatients(
        1,
        filters.value
    )
} 

</script>

<template>
  <q-page class="q-pa-md">

    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">
        Pacientes
      </div>

      <q-btn 
        color="primary"
        icon="add"
        label="Novo Paciente"
        to="/patients/create"
      />

    </div>

    <q-expansion-item
        icon="filter_list"
        label="Filtros"
        header-class="text-primary"
        bordered
        class="q-mb-md"
        >
        <q-card flat>
            <q-card-section>
                <div class="row q-col-gutter-sm">

                    <div class="col-12 col-md-6">
                        <q-input
                            v-model="filters.name"
                            outlined
                            dense
                            clearable
                            label="Nome"
                        />
                    </div>

                    <div class="col-12 col-md-6">
                        <q-input
                            v-model="filters.cpf"
                            outlined
                            dense
                            clearable
                            label="CPF"
                        />
                    </div>

                    <div class="col-12 col-md-6">
                        <q-input
                            v-model="filters.phone"
                            outlined
                            dense
                            clearable
                            label="Telefone"
                        />
                    </div>

                    <div class="col-12 col-md-6">
                        <q-input
                            v-model="filters.birth_date"
                            outlined
                            dense
                            type="date"
                            label="Data de nascimento"
                        />
                    </div>

                </div>

                <div class="row justify-end q-gutter-sm q-mt-md">

                    <q-btn
                        color="negative"
                        icon="clear"
                        label="Limpar"
                        @click="limparFiltros"
                    />

                    <q-btn
                        unelevated
                        color="primary"
                        icon="search"
                        label="Buscar"
                        @click="buscar"
                    />

                </div>
            </q-card-section>
        </q-card>
    </q-expansion-item>

    <q-slide-transition>
      <div v-show="mostrarFiltros" class="q-mb-md">
        <div class="row q-col-gutter-sm">

          <div class="col-12 col-md-8">
            <q-input
              v-model="filters.name"
              outlined
              dense
              clearable
              label="Buscar paciente"
              placeholder="Nome"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.birth_date"
              outlined
              dense
              clearable
              label="Data Paciente"
              type="date"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="search"
              label="Buscar"
              class="full-width"
              @click="buscar"
            />
          </div>

        </div>
      </div>
    </q-slide-transition>

    <q-table
      title="Pacientes"
      :rows="patients"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="tablePagination"
      @request="onRequest"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">

          <q-btn
            flat
            round
            dense
            color="primary"
            icon="edit"
            :to="`/patients/${props.row.id}`"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>

          <q-btn
            flat 
            round
            dense
            color="negative"
            icon="delete"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>

        </q-td>
      </template>
    </q-table>
  </q-page>
</template>