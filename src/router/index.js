import VueRouter from 'vue-router';
import login from '@/views/login';
import chat from '@/views/chat';
import rooms from '@/views/rooms';
import admin from '@/views/admin';

export const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: rooms
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/chat/*',
      name: 'chat',
      component: chat
    },
    {
      path: '/rooms/*',
      name: 'room',
      component: rooms
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: rooms
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    }
  ]
})