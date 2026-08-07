<script setup lang="ts">
import { usePatient } from 'src/composables/usePatient';
import type { MedicalSessions } from 'src/types/MedicalSessions';
import type { Patient } from 'src/types/Patient';
import { computed } from 'vue';

const { fetchAllPatients, patients } = usePatient()

const model = defineModel<Partial<MedicalSessions>>({required: true})

const props = defineProps<{
    loading?: boolean,
    errors: Record<string, string[]>,
    patientSelect?: Patient | undefined,
    editing: boolean
}>()

const emit = defineEmits<{
    submit: []
}>()

const patientOptions = computed(() => {
  if (!props.patientSelect) {
    return patients.value
  }

  const pacienteExiste = patients.value.some(
    patient => patient.id === props.patientSelect?.id
  )

  if (pacienteExiste) {
    return patients.value
  }

  return [props.patientSelect, ...patients.value]
})

const filterPatients = (
  val: string,
  update: (callback: () => void) => void,
  abort: () => void
) => {
    
  const termo = val.trim()

  if (termo.length < 3) {
    abort()
    return
  }

  void fetchAllPatients(val).then(() => {
    update(() => {})
  })
}

</script>

<template>
    <q-form
        @submit.prevent="emit('submit')"
    >
        <q-input
            outlined
            dense
            v-model="model.session_date"
            readonly
            label="Data"
            :error="!!errors.session_date"
            :error-message="errors.session_date?.[0]"
        />

        <q-input
            outlined
            dense
            v-model="model.session_time"
            readonly
            label="Hora"
            :error="!!errors.session_time"
            :error-message="errors.session_time?.[0]"
        />

        <q-select
            v-model="model.patient_id"
            :options="patientOptions"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            use-input
            fill-input
            input-debounce="300"
            @filter="filterPatients"
            outlined
            dense
            :readonly="props.editing"
            label="Paciente"
            :error="!!errors.patient_id"
            :error-message="errors.patient_id?.[0]"
        />

        <q-input 
            v-model="model.notes" 
            filled 
            autogrow
            label="Anotações"
            :error="!!errors.notes"
            :error-message="errors.notes?.[0]"
        />

        <div class="row justify-end q-glutter-sm">

            <q-btn 
                flat
                label="Cancelar"
                to="/medical_sessions"
            />

            <q-btn
                color="primary"
                type="submit"
                label="Salvar"
                :loading="loading"
            />

        </div>

    </q-form>
</template>