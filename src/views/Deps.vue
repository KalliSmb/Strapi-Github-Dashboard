<template>
  <div class="deps-page">
    <h1>📦 Dependências</h1>
    <div class="deps-controls">
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Filtrar por nome..."
        class="input"
      />
      <select v-model="status" class="input">
        <option value="">Todas</option>
        <option value="outdated">Desatualizadas</option>
        <option value="updated">Atualizadas</option>
      </select>
    </div>
    <div class="deps-table">
      <div class="deps-header">
        <span>Nome</span>
        <span>Versão Atual</span>
        <span>Última Versão</span>
        <span>Repositórios</span>
        <span>Estado</span>
      </div>
      <div
        v-for="dep in filteredDeps"
        :key="dep.name"
        class="deps-row"
      >
        <span>{{ dep.name }}</span>
        <span>{{ dep.current_version }}</span>
        <span>{{ dep.latest_version }}</span>
        <span>
          <span
            class="repo-count"
            @mouseenter="showTooltip(dep.name)"
            @mouseleave="hideTooltip"
          >
            {{ dep.repos.length }}
            <span class="repo-tooltip" v-if="tooltipDep === dep.name">
              <strong>Repositórios:</strong>
              <ul>
                <li v-for="repo in dep.repos" :key="repo.id">
                  <a :href="repo.html_url" target="_blank">{{ repo.name }}</a>
                </li>
              </ul>
            </span>
          </span>
        </span>
        <span>
          <span
            v-if="dep.outdated"
            class="badge badge-outdated"
            title="Desatualizada"
          >Desatualizada</span>
          <span
            v-else
            class="badge badge-ok"
            title="Atualizada"
          >Atualizada</span>
        </span>
      </div>
      <div v-if="filteredDeps.length === 0" class="no-results">
        Nenhuma dependência encontrada.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { fetchRepositories } from '@/api/strapi';

const repos = ref<any[]>([]);
const depsMap = ref<Record<string, any>>({});
const search = ref('');
const status = ref('');
const tooltipDep = ref<string | null>(null);

onMounted(async () => {
  repos.value = await fetchRepositories();
  const map: Record<string, any> = {};
  repos.value.forEach(repo => {
    (repo.dependencies || []).forEach((dep: any) => {
      if (!map[dep.name]) {
        map[dep.name] = {
          name: dep.name,
          current_version: dep.current_version,
          latest_version: dep.latest_version,
          outdated: dep.outdated,
          repos: [],
        };
      }
      // Atualiza para a versão mais recente encontrada
      if (dep.latest_version > map[dep.name].latest_version) {
        map[dep.name].latest_version = dep.latest_version;
      }
      // Se alguma estiver desatualizada, marca como desatualizada
      if (dep.outdated) {
        map[dep.name].outdated = true;
      }
      // Adiciona o repositório à lista
      map[dep.name].repos.push({
        id: repo.id,
        name: repo.name,
        html_url: repo.html_url,
      });
    });
  });
  depsMap.value = map;
});

const allDeps = computed(() => Object.values(depsMap.value));

const filteredDeps = computed(() => {
  let list = allDeps.value;
  if (search.value) {
    list = list.filter(dep =>
      dep.name.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  if (status.value === 'outdated') {
    list = list.filter(dep => dep.outdated);
  } else if (status.value === 'updated') {
    list = list.filter(dep => !dep.outdated);
  }
  // Ordena por nome
  return list.sort((a, b) => a.name.localeCompare(b.name));
});

function showTooltip(depName: string) {
  tooltipDep.value = depName;
}
function hideTooltip() {
  tooltipDep.value = null;
}
</script>

<style scoped>
.deps-page {
  max-width: 1000px;
  margin: 0 auto;
}
.deps-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.input {
  padding: 0.5em 1em;
  border: 1px solid #ececec;
  border-radius: 8px;
  font-size: 1em;
  background: #fff;
  min-width: 180px;
}
.deps-table {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(60,60,60,0.07);
  overflow: hidden;
}
.deps-header, .deps-row {
  display: grid;
  grid-template-columns: 2.5fr 1.2fr 1.2fr 1fr 1fr;
  align-items: center;
  padding: 1em 1.5em;
}
.deps-header {
  background: #f1f3f5;
  font-weight: 600;
  color: #495057;
}
.deps-row {
  border-top: 1px solid #f1f3f5;
  transition: background 0.15s;
  position: relative;
}
.deps-row:hover {
  background: #f8fafc;
}
.badge {
  padding: 0.3em 0.8em;
  border-radius: 8px;
  font-size: 0.95em;
  font-weight: 600;
}
.badge-outdated {
  background: #fff0f0;
  color: #d7263d;
}
.badge-ok {
  background: #e6fcf5;
  color: #2b8a3e;
}
.repo-count {
  position: relative;
  cursor: pointer;
  color: #3b5bdb;
  font-weight: 600;
}
.repo-tooltip {
  position: absolute;
  left: 0;
  top: 2em;
  background: #fff;
  color: #213547;
  border: 1px solid #ececec;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(60,60,60,0.13);
  padding: 1em 1.2em;
  z-index: 10;
  min-width: 200px;
  font-size: 0.98em;
}
.repo-tooltip ul {
  margin: 0.5em 0 0 0;
  padding: 0 0 0 1em;
}
.repo-tooltip li {
  margin-bottom: 0.3em;
}
.no-results {
  padding: 2em;
  text-align: center;
  color: #adb5bd;
}
</style>