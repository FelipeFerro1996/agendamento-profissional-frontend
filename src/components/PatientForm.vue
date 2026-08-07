<script setup lang="ts">
import { type Patient } from 'src/types/Patient';


const model = defineModel<Partial<Patient>>({ required: true })

defineProps<{
    loading?: boolean,
    errors: Record<string, string[]>
}>()

const emit = defineEmits<{
    submit: []
}>()

</script>

<template>
    <q-form 
        @submit.prevent="emit('submit')"
    >
        <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
                <q-input
                    v-model="model.name"
                    label="Nome"
                    outlined
                    dense
                    :error="!!errors.name"
                    :error-message="errors.name?.[0]"
                />
            </div>
            <div class="col-12 col-md-6">
                <q-input 
                    v-model="model.email"
                    label="E-mail"
                    outlined
                    dense
                    :error="!!errors.email"
                    :error-message="errors.email?.[0]"
                />
            </div>
        </div>

        <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-4">
                <q-input 
                    v-model="model.phone"
                    label="Celular"
                    outlined
                    dense
                    mask="(##) # ####-####"
                    fill-mask
                    :error="!!errors.phone"
                    :error-message="errors.phone?.[0]"
                />
            </div>
            <div class="col-12 col-md-4">

                <q-input 
                    v-model="model.cpf"
                    label="CPF"
                    outlined
                    dense
                    mask="###.###.###-##"
                    fill-mask
                    :error="!!errors.cpf"
                    :error-message="errors.cpf?.[0]"
                />
            </div>
            <div class="col-12 col-md-4">
                <q-input 
                    v-model="model.birth_date"
                    label="Data nascimento"
                    outlined
                    type="date"
                    dense
                    :error="!!errors.birth_date"
                    :error-message="errors.birth_date?.[0]"
                />

            </div>
        </div>




        <div class="row justify-end q-gutter-sm">

            <q-btn 
                flat
                label="Cancelar"
                to="/patients"
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