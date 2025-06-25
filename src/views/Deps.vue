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
        <span
          class="sortable"
          :class="{ active: sortByRepos }"
          @click="toggleSortByRepos"
          title="Ordenar por número de repositórios"
        >
          Repositórios
          <span v-if="sortByRepos">⬇️</span>
        </span>
      </div>
      <div
        v-for="dep in filteredDeps"
        :key="dep.name"
        class="deps-row"
      >
        <span>{{ dep.name }}</span>
        <span>
          <button class="repo-count" @click="openModal(dep)">
            {{ dep.repos.length }}
          </button>
        </span>
      </div>
      <div v-if="filteredDeps.length === 0" class="no-results">
        Nenhuma dependência encontrada.
      </div>
    </div>

    <!-- Modal de detalhes -->
    <div v-if="modalDep" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>Repositórios que usam <strong>{{ modalDep.name }}</strong></h3>
        <table>
          <thead>
            <tr>
              <th>Repositório</th>
              <th>Versão Atual</th>
              <th>Última Versão</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="repo in modalDep.repos" :key="repo.id">
              <td>
                <router-link :to="`/repos/${repo.id}`" class="repo-link-modal">
                  {{ repo.name }}
                </router-link>
              </td>
              <td>{{ repo.current_version }}</td>
              <td>{{ repo.latest_version }}</td>
              <td>
                <span v-if="repo.outdated" class="badge badge-outdated">Desatualizada</span>
                <span v-else class="badge badge-ok">Atualizada</span>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="btn-close" @click="closeModal">Fechar</button>
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
const modalDep = ref<any>(null);
const sortByRepos = ref(false);

onMounted(async () => {
  repos.value = await fetchRepositories();
  const map: Record<string, any> = {};
  repos.value.forEach(repo => {
    (repo.dependencies || []).forEach((dep: any) => {
      if (!map[dep.name]) {
        map[dep.name] = {
          name: dep.name,
          repos: [],
        };
      }
      map[dep.name].repos.push({
        id: repo.id,
        name: repo.name,
        html_url: repo.html_url,
        current_version: dep.current_version,
        latest_version: dep.latest_version,
        outdated: dep.outdated,
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
    list = list.filter(dep => dep.repos.some((r: any) => r.outdated));
  } else if (status.value === 'updated') {
    list = list.filter(dep => dep.repos.every((r: any) => !r.outdated));
  }
  if (sortByRepos.value) {
    list = [...list].sort((a, b) => b.repos.length - a.repos.length);
  } else {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  }
  return list;
});

function openModal(dep: any) {
  modalDep.value = dep;
}
function closeModal() {
  modalDep.value = null;
}
function toggleSortByRepos() {
  sortByRepos.value = !sortByRepos.value;
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
  min-width: 140px;
}
.deps-table {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(60,60,60,0.07);
  overflow: hidden;
}
.deps-header, .deps-row {
  display: grid;
  grid-template-columns: 2.5fr 1fr;
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
  border: none;
  background: none;
  font-size: 1em;
  padding: 0;
}
.no-results {
  padding: 2em;
  text-align: center;
  color: #adb5bd;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #fff;
  border-radius: 12px;
  padding: 2em;
  min-width: 350px;
  max-width: 90vw;
  box-shadow: 0 2px 16px rgba(60,60,60,0.18);
}
.modal h3 {
  margin-top: 0;
}
.modal table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;
}
.modal th, .modal td {
  padding: 0.5em 0.7em;
  text-align: left;
  border-bottom: 1px solid #f1f3f5;
}
.modal th {
  background: #f1f3f5;
}
.repo-link-modal {
  color: #3b5bdb;
  text-decoration: none;
  font-weight: 500;
}
.repo-link-modal:hover {
  text-decoration: underline;
}
.btn-close {
  margin-top: 1.5em;
  background: #f1f3f5;
  color: #3b5bdb;
  border: none;
  border-radius: 8px;
  padding: 0.5em 1.2em;
  font-weight: 500;
  cursor: pointer;
}
.btn-close:hover {
  background: #e7f5ff;
}
.sortable {
  cursor: pointer;
  user-select: none;
  color: #3b5bdb;
  font-weight: 600;
  transition: color 0.2s;
}
.sortable.active {
  text-decoration: underline;
}
.sortable:hover {
  color: #274690;
}
</style>