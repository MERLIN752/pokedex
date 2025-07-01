<template>
  <div class="pokemon-list-container">
    <div class="search-and-filters">
      <input v-model="searchQuery" type="text" placeholder="Rechercher par nom..." />

      <select v-model="selectedGen">
        <option value="">Toutes les générations</option>
        <option v-for="gen in generations" :key="gen" :value="gen">
          Génération {{ gen }}
        </option>
      </select>

      <div class="type-dropdown">
        <button @click="toggleDropdown" class="dropdown-toggle">
          Types sélectionnés :
          <span v-if="selectedTypes.length === 0">Aucun</span>
          <span v-else>{{ selectedTypes.join(', ') }}</span>
        </button>

        <div v-if="dropdownOpen" class="dropdown-list">
          <label
              v-for="type in types"
              :key="type"
              :class="{ disabled: isDisabled(type) }"
          >
            <input
                type="checkbox"
                :value="type"
                v-model="selectedTypes"
                :disabled="isDisabled(type) && !selectedTypes.includes(type)"
            />
            {{ type }}
          </label>
        </div>
      </div>
      <div v-if="isEvoFilterActive" class="evo-filter-banner">
        <p>Affichage limité à la lignée évolutive du Pokémon sélectionné.</p>
        <button @click="clearEvolutionFilter">Retirer ce filtre</button>
      </div>
    </div>

    <div class="pokemon-grid">
      <div
          v-for="pokemon in filteredPokemons"
          :key="pokemon.id"
          class="pokemon-card"
          @click="openDetails(pokemon)"
          style="cursor: pointer"
      >
        <img :src="pokemon.image" :alt="pokemon.name" />
        <div class="pokemon-info">
          <h3>{{ pokemon.name }}</h3>
          <p>Types : {{ pokemon.types.join(', ') }}</p>
          <p>Génération : {{ pokemon.generation }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-if="!hasMore && !filtersActive" class="end">Tous les Pokémon sont chargés.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePokemonApi } from '../composables/usePokemonApi'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const openDetails = (pokemon) => {
  router.push(`/pokemon/${pokemon.id}`)
}
const { fetchPokemonList, fetchTypes, fetchPokemonDetails } = usePokemonApi()

const pokemons = ref([])
const allPokemons = ref([])
const types = ref([])
const searchQuery = ref(route.query.name || '')
const selectedGen = ref(route.query.gen || '')
const selectedTypes = ref(
    route.query.types
        ? Array.isArray(route.query.types)
            ? route.query.types
            : [route.query.types]
        : []
)
const evolutionChainFilter = ref([])
const isEvoFilterActive = computed(() => evolutionChainFilter.value.length > 0)

const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const offset = ref(0)
const limit = 20
const hasMore = ref(true)
const allLoaded = ref(false)
const loading = ref(false)

const dropdownOpen = ref(false)
const toggleDropdown = () => dropdownOpen.value = !dropdownOpen.value

const isDisabled = (type) => selectedTypes.value.length >= 2 && !selectedTypes.value.includes(type)

const filtersActive = computed(() =>
    searchQuery.value.trim() || selectedGen.value || selectedTypes.value.length > 0
)

const clearEvolutionFilter = async () => {
  evolutionChainFilter.value = []
  allPokemons.value = []
  allLoaded.value = false
  pokemons.value = []
  offset.value = 0
  hasMore.value = true

  const newQuery = { ...route.query }
  delete newQuery.evo
  await router.replace({query: newQuery})

  await loadMorePokemons()
}

const loadMorePokemons = async () => {
  if (loading.value || !hasMore.value || filtersActive.value) return
  loading.value = true
  const { results, hasMore: more } = await fetchPokemonList(limit, offset.value)
  pokemons.value.push(...results)
  offset.value += limit
  hasMore.value = more
  loading.value = false
}

const loadAllPokemons = async () => {
  if (loading.value || allLoaded.value) return

  loading.value = true
  let tmpOffset = 0
  const tempList = []
  let more = true

  while (more) {
    const { results, hasMore: next } = await fetchPokemonList(100, tmpOffset)
    tempList.push(...results)
    tmpOffset += 100
    more = next
  }

  allPokemons.value = tempList
  allLoaded.value = true
  loading.value = false

  console.log('[DEBUG] Total Pokémon chargés :', tempList.length)
}

const filteredPokemons = computed(() => {
  const list = (filtersActive.value || isEvoFilterActive.value)
      ? allPokemons.value
      : pokemons.value

  const result = list.filter(p => {
    const nameMatch = p.name?.toLowerCase().includes(searchQuery.value?.toLowerCase().trim())
    const genMatch = selectedGen.value ? p.generation === parseInt(selectedGen.value) : true

    const typeMatch =
        selectedTypes.value.length === 0
            ? true
            : selectedTypes.value.length === 1
                ? p.types.includes(selectedTypes.value[0])
                : selectedTypes.value.every(t => p.types.includes(t))

    const evoMatch = isEvoFilterActive.value
        ? evolutionChainFilter.value.includes(p.id)
        : true

    return nameMatch && genMatch && typeMatch && evoMatch
  })

  console.log('[DEBUG] Pokémon affichés :', result.map(p => p.name))
  return result
})

onMounted(async () => {
  types.value = await fetchTypes()

  const evoId = route.query.evo

  if (evoId) {
    const details = await fetchPokemonDetails(evoId)
    evolutionChainFilter.value = details.evolutionChain.map(e => parseInt(e.id))

    // Charger tous les Pokémon pour pouvoir filtrer la lignée
    await loadAllPokemons()
  } else {
    await loadMorePokemons()
  }

  // scroll
  window.addEventListener('scroll', () => {
    if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 &&
        !filtersActive.value &&
        !isEvoFilterActive.value
    ) {
      loadMorePokemons()
    }
  })
})

watch([searchQuery, selectedGen, selectedTypes], async () => {
  const query = { ...route.query }

  if (searchQuery.value.trim()) {
    query.name = searchQuery.value.trim()
  } else {
    delete query.name
  }

  if (selectedGen.value) {
    query.gen = selectedGen.value
  } else {
    delete query.gen
  }

  if (selectedTypes.value.length > 0) {
    query.types = selectedTypes.value
  } else {
    delete query.types
  }

  await router.replace({query})

  if (filtersActive.value && !isEvoFilterActive.value && allPokemons.value.length === 0) {
    await loadAllPokemons()
  }
})

watch(() => route.query, () => {
  searchQuery.value = route.query.name || ''
  selectedGen.value = route.query.gen || ''
  selectedTypes.value = route.query.types
      ? Array.isArray(route.query.types)
          ? route.query.types
          : [route.query.types]
      : []
})

watch(evolutionChainFilter, (val) => {
  console.log('[DEBUG] Filtre lignée active avec ids :', val)
})
</script>

<style scoped>
.pokemon-list-container {
  padding: 1rem;
}

.search-and-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-and-filters input,
.search-and-filters select {
  padding: 0.5rem;
  font-size: 1rem;
}

.type-dropdown {
  position: relative;
}

.dropdown-toggle {
  padding: 0.5rem;
  background: #f0f0f0;
  border: 1px solid #aaa;
  cursor: pointer;
}

.dropdown-list {
  position: absolute;
  top: 110%;
  left: 0;
  z-index: 10;
  background: white;
  border: 1px solid #ccc;
  padding: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.dropdown-list label.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.pokemon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.pokemon-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  width: 200px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.pokemon-card img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.pokemon-info h3 {
  margin: 0.2rem 0;
  font-size: 1.1rem;
}

.loading, .end {
  text-align: center;
  margin-top: 2rem;
  font-weight: bold;
}
</style>