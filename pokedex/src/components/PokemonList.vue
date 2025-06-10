<template>
  <div class="pokedex-container">
    <h1 class="pokedex-title">Pokédex</h1>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom"
          class="search-input"
      />

      <select v-model="selectedType" class="search-select">
        <option value="">Tous les types</option>
        <option v-for="type in allTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <!-- Grille Pokémon -->
    <div class="grid">
      <div
          v-for="pokemon in filteredPokemons"
          :key="pokemon.name"
          class="card"
      >
        <img
            :src="pokemon.image"
            :alt="pokemon.name"
            loading="lazy"
            class="pokemon-image"
        />
        <p class="pokemon-name">{{ pokemon.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const pokemons = ref([])
const allTypes = ref(new Set())
const searchQuery = ref('')
const selectedType = ref('')

const fetchPokemons = async () => {
  const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=5000'
  )
  const data = await response.json()

  const promises = data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url)
    const details = await res.json()

    const types = details.types.map((t) => t.type.name)
    types.forEach((t) => allTypes.value.add(t))

    return {
      name: pokemon.name,
      image:
          details.sprites.other['official-artwork'].front_default ||
          details.sprites.front_default,
      types,
    }
  })

  pokemons.value = await Promise.all(promises)
}

const filteredPokemons = computed(() => {
  return pokemons.value.filter((pokemon) => {
    const matchesName = pokemon.name
        .toLowerCase()
        .startsWith(searchQuery.value.toLowerCase())
    const matchesType =
        !selectedType.value ||
        pokemon.types.includes(selectedType.value)
    return matchesName && matchesType
  })
})

onMounted(fetchPokemons)
</script>

<style scoped>
/* Container principal */
.pokedex-container {
  margin: 2rem;
  padding: 1rem;
  background: linear-gradient(145deg, #e60012, #b0000d);
  border-radius: 20px;
  box-shadow:
      inset 0 4px 8px rgba(255, 255, 255, 0.6),
      0 10px 20px rgba(176, 0, 13, 0.7);
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Titre */
.pokedex-title {
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 2rem;
  text-shadow:
      2px 2px 0 #3a0000,
      4px 4px 8px rgba(0, 0, 0, 0.6);
  user-select: none;
}

/* Grille */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

/* Carte Pokémon */
.card {
  background: linear-gradient(145deg, #f0f0f0, #dcdcdc);
  border-radius: 16px;
  padding: 1rem;
  width: 100%;
  max-width: 180px;
  box-shadow:
      6px 6px 8px #b8b8b8,
      -6px -6px 8px #ffffff;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  user-select: none;
  border: 3px solid #b0000d;
}

/* Hover effet "bouton" */
.card:hover {
  transform: scale(1.1);
  box-shadow:
      8px 8px 15px #900000,
      -8px -8px 15px #ff3b3b;
  border-color: #ff3b3b;
}

/* Image */
.pokemon-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 0.8rem;
  filter: drop-shadow(0 2px 2px rgba(176, 0, 13, 0.5));
  transition: filter 0.3s ease;
}

.card:hover .pokemon-image {
  filter: drop-shadow(0 4px 4px rgba(255, 59, 59, 0.9));
}

/* Nom */
.pokemon-name {
  font-weight: 700;
  font-size: 1.25rem;
  text-transform: capitalize;
  color: #7a0000;
  text-shadow:
      1px 1px 0 #fff;
}

.search-bar {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input,
.search-select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  min-width: 200px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
