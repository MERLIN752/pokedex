<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { usePokemonApi } from '../composables/usePokemonApi'

const route = useRoute()
const { fetchPokemonDetails } = usePokemonApi()

const chain = ref([])
const loading = ref(true)

onMounted(async () => {
  const pokemonId = route.params.id
  const details = await fetchPokemonDetails(pokemonId)
  chain.value = details.evolutionChain
  loading.value = false
})
</script>

<template>
  <div v-if="loading">Chargement de la lignée...</div>

  <div v-else class="evolution-chain">
    <h2>Lignée évolutive</h2>

    <div class="chain">
      <div v-for="pokemon in chain" :key="pokemon.id" class="evo-pokemon">
        <RouterLink :to="`/pokemon/${pokemon.id}`">{{ pokemon.name }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chain {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.evo-pokemon {
  padding: 0.5rem;
  background: #f2f2f2;
  border-radius: 8px;
}
</style>