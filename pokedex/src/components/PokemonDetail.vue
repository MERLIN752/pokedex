<template>
  <div v-if="pokemon" class="pokemon-detail">
    <div class="detail-header">
      <button @click="$router.go(-1)" class="back-btn">← Retour</button>
      <button
          @click="toggleFavorite"
          class="favorite-btn"
          :class="{ active: isFavorite(pokemon.id) }"
      >
        ❤️ {{ isFavorite(pokemon.id) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
      </button>
    </div>

    <div class="pokemon-card">
      <div class="pokemon-image-section">
        <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image"/>
        <h1 class="pokemon-name">{{ pokemon.name }}</h1>
        <p class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
      </div>

      <div class="pokemon-info">
        <div class="info-section">
          <h2>Types</h2>
          <div class="types">
            <span v-for="type in pokemon.types" :key="type" class="type-badge" :class="type">
              {{ type }}
            </span>
          </div>
        </div>

        <div class="info-section">
          <h2>Informations</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Taille:</span>
              <span class="stat-value">{{ (pokemon.height / 10).toFixed(1) }}m</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Poids:</span>
              <span class="stat-value">{{ (pokemon.weight / 10).toFixed(1) }}kg</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Génération:</span>
              <span class="stat-value">{{ pokemon.generation }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h2>Description</h2>
          <p class="description">{{ pokemon.description.replace(/\f/g, ' ') }}</p>
        </div>

        <div class="info-section">
          <h2>Statistiques</h2>
          <div class="stats">
            <div v-for="stat in pokemon.stats" :key="stat.name" class="stat">
              <span class="stat-name">{{ formatStatName(stat.name) }}</span>
              <div class="stat-bar">
                <div class="stat-fill" :style="{ width: `${(stat.value / 255) * 100}%` }"></div>
              </div>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
          </div>
        </div>

        <div v-if="pokemon.evolutionChain.length > 1" class="info-section">
          <h2>Évolutions</h2>
          <div class="evolutions">
            <div
                v-for="(evolution, index) in pokemon.evolutionChain"
                :key="evolution.id"
                class="evolution-item"
            >
              <router-link :to="`/pokemon/${evolution.id}`" class="evolution-link">
                <div class="evolution-pokemon" :class="{ current: evolution.id === pokemon.id }">
                  <span class="evolution-name">{{ evolution.name }}</span>
                </div>
              </router-link>
              <span v-if="index < pokemon.evolutionChain.length - 1" class="evolution-arrow">→</span>
            </div>
          </div>
          <RouterLink :to="`/?evo=${pokemon.id}`" class="evolution-link">
            Voir la lignée évolutive
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="loading">
    Chargement...
  </div>

  <div v-else class="error">
    Pokémon non trouvé
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRoute} from 'vue-router'
import {usePokemonApi} from '../composables/usePokemonApi'
import {useFavorites} from '../composables/useFavorites'

const props = defineProps(['id'])
const route = useRoute()
const {fetchPokemonDetails} = usePokemonApi()
const {addToFavorites, removeFromFavorites, isFavorite} = useFavorites()

const pokemon = ref(null)
const loading = ref(true)

const toggleFavorite = () => {
  if (isFavorite(pokemon.value.id)) {
    removeFromFavorites(pokemon.value.id)
  } else {
    addToFavorites(pokemon.value)
  }
}

const formatStatName = (name) => {
  const statNames = {
    'hp': 'PV',
    'attack': 'Attaque',
    'defense': 'Défense',
    'special-attack': 'Att. Spé.',
    'special-defense': 'Déf. Spé.',
    'speed': 'Vitesse'
  }
  return statNames[name] || name
}

onMounted(async () => {
  try {
    pokemon.value = await fetchPokemonDetails(route.params.id)
  } catch (error) {
    console.error('Erreur lors du chargement du Pokémon:', error)
  } finally {
    loading.value = false
  }
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    pokemon.value = await fetchPokemonDetails(newId)
  }
})
</script>

<style scoped>
.pokemon-detail {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: #e60012;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.back-btn:hover {
  background: #b0000d;
}

.favorite-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: #ff6b6b;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-btn:hover,
.favorite-btn.active {
  background: #ff5252;
  transform: scale(1.05);
}

.pokemon-card {
  background: linear-gradient(145deg, #f0f0f0, #dcdcdc);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.pokemon-image-section {
  text-align: center;
}

.pokemon-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
}

.pokemon-name {
  font-size: 2.5rem;
  font-weight: 900;
  color: #e60012;
  text-transform: capitalize;
  margin: 1rem 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.pokemon-id {
  font-size: 1.2rem;
  color: #666;
  font-weight: 600;
}

.pokemon-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section h2 {
  color: #e60012;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e60012;
  padding-bottom: 0.5rem;
}

.types {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  font-size: 1rem;
}

/* Couleurs des types (répétées) */
.type-badge.normal {
  background: #A8A878;
}

.type-badge.fire {
  background: #F08030;
}

.type-badge.water {
  background: #6890F0;
}

.type-badge.electric {
  background: #F8D030;
  color: #333;
}

.type-badge.grass {
  background: #78C850;
}

.type-badge.ice {
  background: #98D8D8;
}

.type-badge.fighting {
  background: #C03028;
}

.type-badge.poison {
  background: #A040A0;
}

.type-badge.ground {
  background: #E0C068;
}

.type-badge.flying {
  background: #A890F0;
}

.type-badge.psychic {
  background: #F85888;
}

.type-badge.bug {
  background: #A8B820;
}

.type-badge.rock {
  background: #B8A038;
}

.type-badge.ghost {
  background: #705898;
}

.type-badge.dragon {
  background: #7038F8;
}

.type-badge.dark {
  background: #705848;
}

.type-badge.steel {
  background: #B8B8D0;
}

.type-badge.fairy {
  background: #EE99AC;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-weight: 600;
  color: #666;
}

.stat-value {
  font-weight: 700;
  color: #e60012;
}

.description {
  line-height: 1.6;
  color: #555;
  font-size: 1.1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  align-items: center;
  gap: 1rem;
}

.stat-name {
  font-weight: 600;
  color: #666;
  text-transform: capitalize;
}

.stat-bar {
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #e60012);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.evolutions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.evolution-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.evolution-link {
  text-decoration: none;
}

.evolution-pokemon {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.evolution-pokemon:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-color: #e60012;
}

.evolution-pokemon.current {
  border-color: #e60012;
  background: #fff5f5;
}

.evolution-name {
  font-weight: 600;
  color: #333;
  text-transform: capitalize;
}

.evolution-arrow {
  font-size: 1.5rem;
  color: #e60012;
  font-weight: bold;
}

.family-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #e60012;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.family-link:hover {
  background: #b0000d;
}

.loading,
.error {
  text-align: center;
  font-size: 1.5rem;
  margin: 4rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .pokemon-card {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .pokemon-image {
    width: 200px;
    height: 200px;
  }

  .pokemon-name {
    font-size: 2rem;
  }

  .detail-header {
    flex-direction: column;
    gap: 1rem;
  }

  .stat {
    grid-template-columns: 80px 1fr 50px;
    gap: 0.5rem;
  }

  .evolutions {
    flex-direction: column;
    align-items: stretch;
  }

  .evolution-item {
    justify-content: center;
  }
}

.evolution-link {
  display: inline-block;
  margin-top: 1rem;
  color: #007bff;
  text-decoration: underline;
}

.evolution-link:hover {
  text-decoration: none;
}
</style>