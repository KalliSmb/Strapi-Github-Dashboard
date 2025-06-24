<template>
  <div class="repo-card">
    <div class="repo-header">
      <h2>
        <a :href="repo.html_url" target="_blank" rel="noopener">{{ repo.name }}</a>
      </h2>
      <span class="repo-lang">{{ repo.language }}</span>
    </div>
    <p class="repo-desc">{{ repo.description || 'Sem descrição' }}</p>
    <div class="repo-owner">👤 {{ repo.owner }}</div>
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
  </div>
</template>

<script setup lang="ts">
defineProps<{ repo: any }>();
</script>

<style scoped>
.repo-card {
  border: 1px solid #e0e0e0;
  background: #fff;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(60,60,60,0.07);
  text-align: left;
  transition: box-shadow 0.2s;
}
.repo-card:hover {
  box-shadow: 0 4px 16px rgba(60,60,60,0.13);
}
.repo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.repo-header h2 {
  margin: 0;
  font-size: 1.4em;
}
.repo-header a {
  color: #3b5bdb;
  text-decoration: none;
}
.repo-header a:hover {
  text-decoration: underline;
}
.repo-lang {
  background: #f1f3f5;
  color: #495057;
  padding: 0.2em 0.7em;
  border-radius: 8px;
  font-size: 0.9em;
  margin-left: 1em;
}
.repo-desc {
  margin: 0.7em 0 0.5em 0;
  color: #495057;
}
.repo-owner {
  font-size: 0.95em;
  color: #868e96;
  margin-bottom: 1em;
}
.dep-list {
  list-style: none;
  padding: 0;
  margin: 0;
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
</style>