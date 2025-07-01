<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link">
        <h1 class="nav-title">Pokédex</h1>
      </router-link>
      <router-link to="/favorites" class="nav-link favorites-link">
        ❤️ Favoris ({{ favoritesCount }})
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavorites } from './composables/useFavorites'

const { favorites } = useFavorites()
const favoritesCount = computed(() => favorites.value.length)
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.navbar {
  background: linear-gradient(145deg, #e60012, #b0000d);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.nav-link {
  text-decoration: none;
  color: white;
}

.nav-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.favorites-link {
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.favorites-link:hover {
  background: rgba(255,255,255,0.3);
}
</style>