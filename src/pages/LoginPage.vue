<template>
  <q-page class="flex flex-center">
    <q-card style="width: 350px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-input 
          v-model="email" 
          label="Email" 
          type="email"
          :error="!!errors.email"
          :error-message="errors.email?.[0] ?? ''" 
        />
        <q-input 
          v-model="password" 
          label="Senha" 
          type="password" 
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Entrar" color="primary" @click="handleLogin" :loading="loading" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from 'src/composables/useAuth'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { type ValidationErrorResponse } from 'src/composables/useApi'

const $q = useQuasar()
const errors = ref<Record<string, string[]>>({})

const email = ref('')
const password = ref('')
const loading = ref(false)

const router = useRouter()
const { login } = useAuth()

const handleLogin = async () => {
    try {
        loading.value = true

        await login(email.value, password.value)

        await router.push('/')
        $q.notify({
          type: 'positive',
          message: "Login realizado com sucesso"
        })
    } catch (error: unknown) {
        if (axios.isAxiosError<ValidationErrorResponse>(error)) {

          if (error.response?.status === 422) {
            errors.value = error.response.data.errors ?? {};
            return;
          }else{

            $q.notify({
              type: 'negative',
              message: error.response?.data.message ?? 'Ocorreu um erro.'
            });
            
          }

        }
    } finally {
        loading.value = false
    }
}

</script>