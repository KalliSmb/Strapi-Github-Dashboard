<template>
  <div class="repo-card">
    <h2>{{ repo.name || 'Sem nome' }}</h2>
    <p>{{ repo.description || 'Sem descrição' }}</p>
    <ul>
      <li
        v-for="dep in repo.dependencies || []"
        :key="dep.id"
        :class="{ outdated: dep.outdated }"
      >
        🔹 {{ dep.name }} — 
        {{ dep.current_version }} → 
        <strong>{{ dep.latest_version }}</strong>
        <span v-if="dep.outdated">⚠️</span>
      </li>
      <li v-if="!repo.dependencies?.length">
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
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}
.outdated {
  color: red;
  font-weight: bold;
}
</style>