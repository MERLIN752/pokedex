<template>
  <div class="favorites-container">
    <h1 class="favorites-title">Mes Pokémon Favoris</h1>

    <div v-if="favorites.length === 0" class="empty-favorites">
      <p>Aucun Pokémon dans vos favoris</p>
      <router-link to="/" class="browse-link">Parcourir le Pokédex</router-link>
    </div>

    <div v-else class="favorites-grid">
      <div
          v-for="pokemon in favorites"
          :key="pokemon.id"
          class="favorite-card"
          @click="$router.push(`/pokemon/${pokemon.id}`)"
      >
        <button
            @click.stop="removeFromFavorites(pokemon.id)"
            class="remove-btn"
            title="Retirer des favoris"
        >
          ❌
        </button>

        <img
            :src="pokemon.image"
            :alt="pokemon.name"
            class="pokemon-image"
        />
        <p class="pokemon-name">{{ pokemon.name }}</p>
        <div class="pokemon-types">
          <span v-for="type in pokemon.types" :key="type" class="type-badge" :class="type">
            {{ type }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavorites } from '../composables/useFavorites'

const { favorites, removeFromFavorites } = useFavorites()
</script>

<style scoped>
.favorites-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.favorites-title {
  text-align: center;
  font-size: 2.5rem;
  color: #e60012;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.empty-favorites {
  text-align: center;
  margin: 4rem 0;
}

.empty-favorites p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
}

.browse-link {
  display: inline-block;
  padding: 1rem 2rem;
  background: #e60012;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.browse-link:hover {
  background: #b0000d;
  transform: translateY(-2px);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

.favorite-card {
  background: linear-gradient(145deg, #f0f0f0, #dcdcdc);
  border-radius: 16px;
  padding: 1rem;
  width: 100%;
  max-width: 220px;
  position: relative;
  box-shadow: 6px 6px 8px #b8b8b8, -6px -6px 8px #ffffff;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  user-select: none;
  border: 3px solid #e60012;
}

.favorite-card:hover {
  transform: scale(1.05);
  box-shadow: 8px 8px 15px #900000, -8px -8px 15px #ff3b3b;
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.remove-btn:hover {
  opacity: 1;
}

.pokemon-image {
  width: 140px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.pokemon-name {
  font-weight: 700;
  font-size: 1.2rem;
  text-transform: capitalize;
  color: #7a0000;
  text-shadow: 1px 1px 0 #fff;
  margin-bottom: 0.5rem;
}

.pokemon-types {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  flex-wrap: wrap;
}

.type-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
}

/* Couleurs des types (répétées) */
.type-badge.normal { background: #A8A878; }
.type-badge.fire { background: #F08030; }
.type-badge.water { background: #6890F0; }
.type-badge.electric { background: #F8D030; color: #333; }
.type-badge.grass { background: #78C850; }
.type-badge.ice { background: #98D8D8; }
.type-badge.fighting { background: #C03028; }
.type-badge.poison { background: #A040A0; }
.type-badge.ground { background: #E0C068; }
.type-badge.flying { background: #A890F0; }
.type-badge.psychic { background: #F85888; }
.type-badge.bug { background: #A8B820; }
.type-badge.rock { background: #B8A038; }
.type-badge.ghost { background: #705898; }
.type-badge.dragon { background: #7038F8; }
.type-badge.dark { background: #705848; }
.type-badge.steel { background: #B8B8D0; }
.type-badge.fairy { background: #EE99AC; }

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .favorite-card {
    max-width: 180px;
  }

  .pokemon-image {
    width: 100px;
    height: 100px;
  }
}
</style>