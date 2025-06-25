<template>
  <div class="repo-detail-page" v-if="repo">
    <h1>
      <a :href="repo.html_url" target="_blank" rel="noopener">{{ repo.name }}</a>
    </h1>
    <p class="desc">{{ repo.description || 'Sem descrição' }}</p>
    <div class="meta">
      <span class="lang-badge">{{ repo.language }}</span>
      <span class="owner">👤 {{ repo.owner }}</span>
    </div>
    <h2>Dependências</h2>
    <ul class="dep-list">
      <li
        v-for="dep in repo.dependencies || []"
        :key="dep.id"
        :class="{ outdated: dep.outdated }"
      >
        <span class="dep-name">🔹 {{ dep.name }}</span>
        <span class="dep-version">{{ dep.current_version }} → <strong>{{ dep.latest_version }}</strong></span>
        <span v-if="dep.outdated" class="dep-alert">⚠️ Desatualizada</span>
      </li>
      <li v-if="!repo.dependencies?.length" class="no-deps">
        Nenhuma dependência encontrada.
      </li>
    </ul>
    <router-link to="/repos" class="btn-back">← Voltar</router-link>
  </div>
  <div v-else class="loading">A carregar...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchRepositories } from '@/api/strapi';

const route = useRoute();
const repo = ref<any>(null);

onMounted(async () => {
  const repos = await fetchRepositories();
  repo.value = repos.find((r: any) => String(r.id) === route.params.id);
});
</script>

<style scoped>
.repo-detail-page {
  max-width: 700px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(60,60,60,0.07);
  padding: 2.5rem 2rem;
}
.repo-detail-page h1 {
  font-size: 2em;
  margin-bottom: 0.2em;
}
.repo-detail-page a {
  color: #3b5bdb;
  text-decoration: none;
}
.repo-detail-page a:hover {
  text-decoration: underline;
}
.desc {
  color: #495057;
  margin-bottom: 1em;
}
.meta {
  margin-bottom: 2em;
  display: flex;
  gap: 1.5em;
  align-items: center;
}
.lang-badge {
  background: #e7f5ff;
  color: #228be6;
  padding: 0.2em 0.7em;
  border-radius: 8px;
  font-size: 0.95em;
}
.owner {
  color: #868e96;
}
.dep-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2em 0;
}
.dep-list li {
  padding: 0.4em 0;
  border-bottom: 1px solid #f1f3f5;
  display: flex;
  align-items: center;
  gap: 0.7em;
}
.dep-list li:last-child {
  border-bottom: none;
}
.dep-name {
  font-weight: 500;
}
.dep-version {
  color: #868e96;
}
.dep-alert {
  color: #d7263d;
  font-weight: bold;
  margin-left: 0.5em;
}
.no-deps {
  color: #adb5bd;
  font-style: italic;
}
.outdated {
  background: #fff0f0;
}
.btn-back {
  display: inline-block;
  margin-top: 1.5em;
  background: #f1f3f5;
  color: #3b5bdb;
  padding: 0.5em 1.2em;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}
.btn-back:hover {
  background: #e7f5ff;
}
.loading {
  text-align: center;
  color: #868e96;
  padding: 3em;
}
</style>