<template>
  <div>
    <h1>📊 Dashboard de Repositórios</h1>
    <RepoCard
      v-for="repo in repos"
      :key="repo.id"
      :repo="repo"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchRepositories } from '@/api/strapi';
import RepoCard from '@/components/RepoCard.vue';

const repos = ref<any[]>([]);

onMounted(async () => {
  repos.value = await fetchRepositories();
  console.log('Repos:', repos.value);
});
</script>