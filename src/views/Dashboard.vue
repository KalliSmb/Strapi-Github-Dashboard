<template>
  <div class="dashboard-container">
    <h1>📊 Dashboard de Repositórios</h1>
    <div class="dashboard-cards">
      <div class="card summary">
        <div class="card-title">✅ Total de Repositórios</div>
        <div class="card-value">{{ totalRepos }}</div>
      </div>
      <div class="card summary">
        <div class="card-title">📦 Total de Dependências</div>
        <div class="card-value">{{ totalDeps }}</div>
      </div>
      <div class="card summary alert">
        <div class="card-title">⚠️ Dependências Desatualizadas</div>
        <div class="card-value">{{ outdatedDeps }}</div>
      </div>
      <!-- Aqui podes adicionar os gráficos (pie/bar) com chart.js ou apexcharts -->
      <div class="card chart">
        <div class="card-title">🟢 Linguagens mais usadas</div>
        <canvas id="pie-langs"></canvas>
      </div>
      <div class="card chart">
        <div class="card-title">📉 Repos com + dependências desatualizadas</div>
        <canvas id="bar-outdated"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchRepositories } from '@/api/strapi';

const repos = ref<any[]>([]);
const totalRepos = ref(0);
const totalDeps = ref(0);
const outdatedDeps = ref(0);

onMounted(async () => {
  repos.value = await fetchRepositories();
  totalRepos.value = repos.value.length;
  totalDeps.value = repos.value.reduce((acc, r) => acc + (r.dependencies?.length || 0), 0);
  outdatedDeps.value = repos.value.reduce(
    (acc, r) => acc + (r.dependencies?.filter((d: any) => d.outdated).length || 0),
    0
  );
  // Aqui podes preparar os dados para os gráficos
});
</script>

<style scoped>
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}
.card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(60,60,60,0.07);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.card.summary {
  min-height: 120px;
  justify-content: center;
}
.card-title {
  font-size: 1.1em;
  color: #868e96;
  margin-bottom: 0.5em;
}
.card-value {
  font-size: 2.2em;
  font-weight: 600;
  color: #3b5bdb;
}
.card.alert .card-value {
  color: #d7263d;
}
.card.chart {
  min-height: 260px;
}
</style>