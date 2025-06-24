<template>
  <div class="layout">
    <aside class="sidebar">
      <nav>
        <ul>
          <li :class="{active: route.name === 'dashboard'}">
            <router-link to="/">📊 Dashboard</router-link>
          </li>
          <li :class="{active: route.name === 'repos'}">
            <router-link to="/repos">📁 Repositórios</router-link>
          </li>
          <li :class="{active: route.name === 'deps'}">
            <router-link to="/deps">📦 Dependências</router-link>
          </li>
          <li :class="{active: route.name === 'alerts'}">
            <router-link to="/alerts">🚨 Alertas</router-link>
          </li>
          <li>
            <router-link to="/settings">⚙️ Definições</router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f9f9f9;
}
.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #ececec;
  box-shadow: 2px 0 8px rgba(60,60,60,0.04);
  padding: 2rem 1rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  margin-bottom: 1.2em;
}
.sidebar a {
  color: #213547;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1em;
  transition: color 0.2s;
}
.sidebar .active a,
.sidebar a.router-link-exact-active {
  color: #3b5bdb;
}
.main-content {
  flex: 1;
  padding: 2.5rem 3vw;
}
</style>