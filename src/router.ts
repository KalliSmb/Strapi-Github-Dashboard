import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './views/Dashboard.vue';
const Repos = () => import('./views/Repos.vue');
const Deps = () => import('./views/Deps.vue');
const Alerts = () => import('./views/Alerts.vue');
const Settings = () => import('./views/Settings.vue');
const RepoDetail = () => import('./views/RepoDetail.vue');

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/repos', name: 'repos', component: Repos },
    { path: '/repos/:id', name: 'repo-detail', component: RepoDetail },
    { path: '/deps', name: 'deps', component: Deps },
    { path: '/alerts', name: 'alerts', component: Alerts },
    { path: '/settings', name: 'settings', component: Settings },
  ],
});