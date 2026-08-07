<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Agendamento Profissional </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
         <q-btn
          flat
          round
          dense
          icon="logout"
          @click="handleLogout"
        >
          <q-tooltip>Sair</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menus </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { useAuth } from 'src/composables/useAuth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const { logout } = useAuth()
const router = useRouter()
const $q = useQuasar()

const linksList: EssentialLinkProps[] = [
  {
    title: 'Home',
    caption: 'Dashboard',
    icon: 'home',
    to: '/'
  },
  {
    title: 'Pacientes',
    caption: 'Lista de pacientes',
    icon: 'people',
    to: '/patients'
  },
  {
    title: 'Agenda',
    caption: 'Agendamentos',
    icon: 'event',
    to: '/medical_sessions'
  }
]

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const handleLogout = async () => {
  
  await logout()
  await router.push('/login')
  
  $q.notify({
    type: 'positive',
    message: 'Volte sempre!!'
  })

}

</script>
