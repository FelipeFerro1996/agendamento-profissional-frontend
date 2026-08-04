import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue')
      }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      }
    ],
  },

  {
    path: '/patients',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/PatientsPage.vue'),
      },
      {
        path: 'create',
        component: () => import('pages/PatientsCreatePage.vue'),
      },
      {
        path: ':id',
        component: () => import('pages/PatientsUpdatePage.vue'),
      }
    ],
  },

  {
    path: '/medical_sessions',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/MedicalSessionsPage.vue'),
        name: 'medical-sessions-list',
        props: true
      },
      {
        path: 'create',
        component: () => import('pages/MedicalSessionsCreatePage.vue'),
        name:'medical-session-create',
        props: true
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
