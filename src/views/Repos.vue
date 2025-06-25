<template>
  <div class="repos-page">
    <h1>📁 Repositórios</h1>
    <div class="repos-controls">
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Filtrar por nome..."
        class="input"
      />
      <select v-model="selectedLang" class="input">
        <option value="">Todas as linguagens</option>
        <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
      </select>
      <select v-model="sortBy" class="input">
        <option value="name">Ordenar por nome</option>
        <option value="outdated">Mais desatualizadas</option>
      </select>
    </div>
    <div class="repos-table">
      <div class="repos-header">
        <span>Nome</span>
        <span>Linguagem</span>
        <span>Dependências</span>
        <span>Alertas</span>
        <span></span>
      </div>
      <div
        v-for="repo in filteredRepos"
        :key="repo.id"
        class="repos-row"
      >
        <span>
          <a :href="repo.html_url" target="_blank" rel="noopener" class="repo-link">
            {{ repo.name }}
          </a>
        </span>
        <span>
          <span class="lang-badge">{{ repo.language || '—' }}</span>
        </span>
        <span>
          <span>{{ repo.dependencies?.length || 0 }}</span>
          <span v-if="countOutdated(repo) > 0" class="deps-alert">
            ({{ countOutdated(repo) }})
          </span>
        </span>
        <span>
          <span v-if="countOutdated(repo) > 0" class="icon-alert" title="Dependências desatualizadas">⚠️</span>
        </span>
        <span>
          <router-link :to="`/repos/${repo.id}`" class="btn-details">Ver detalhes</router-link>
        </span>
      </div>
      <div v-if="filteredRepos.length === 0" class="no-results">
        Nenhum repositório encontrado.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { fetchRepositories } from '@/api/strapi';

const repos = ref<any[]>([]);
const search = ref('');
const selectedLang = ref('');
const sortBy = ref('name');

onMounted(async () => {
  repos.value = await fetchRepositories();
});

const languages = computed(() => {
  const langs = new Set<string>();
  repos.value.forEach(r => r.language && langs.add(r.language));
  return Array.from(langs).sort();
});

function countOutdated(repo: any) {
  return repo.dependencies?.filter((d: any) => d.outdated).length || 0;
}

const filteredRepos = computed(() => {
  let list = repos.value;
  if (search.value) {
    list = list.filter(r =>
      r.name.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  if (selectedLang.value) {
    list = list.filter(r => r.language === selectedLang.value);
  }
  if (sortBy.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'outdated') {
    list = [...list].sort((a, b) => countOutdated(b) - countOutdated(a));
  }
  return list;
});
</script>

<style scoped>
.repos-page {
  max-width: 1000px;
  margin: 0 auto;
}
.repos-controls {
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
.repos-table {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(60,60,60,0.07);
  overflow: hidden;
}
.repos-header, .repos-row {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1.2fr 0.7fr 1fr;
  align-items: center;
  padding: 1em 1.5em;
}
.repos-header {
  background: #f1f3f5;
  font-weight: 600;
  color: #495057;
}
.repos-row {
  border-top: 1px solid #f1f3f5;
  transition: background 0.15s;
}
.repos-row:hover {
  background: #f8fafc;
}
.repo-link {
  color: #3b5bdb;
  text-decoration: none;
  font-weight: 500;
}
.repo-link:hover {
  text-decoration: underline;
}
.lang-badge {
  background: #e7f5ff;
  color: #228be6;
  padding: 0.2em 0.7em;
  border-radius: 8px;
  font-size: 0.95em;
}
.deps-alert {
  color: #d7263d;
  font-weight: 600;
  margin-left: 0.3em;
}
.icon-alert {
  color: #d7263d;
  font-size: 1.3em;
}
.btn-details {
  background: #3b5bdb;
  color: #fff;
  padding: 0.4em 1em;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.97em;
  transition: background 0.2s;
}
.btn-details:hover {
  background: #274690;
}
.no-results {
  padding: 2em;
  text-align: center;
  color: #adb5bd;
}
</style>