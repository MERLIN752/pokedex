import { ref, computed } from 'vue'

const FAVORITES_KEY = 'pokedex-favorites'

// État global des favoris
const favorites = ref(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'))

export function useFavorites() {
    const saveFavorites = () => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
    }

    const addToFavorites = (pokemon) => {
        if (!favorites.value.find(p => p.id === pokemon.id)) {
            favorites.value.push(pokemon)
            saveFavorites()
        }
    }

    const removeFromFavorites = (pokemonId) => {
        favorites.value = favorites.value.filter(p => p.id !== pokemonId)
        saveFavorites()
    }

    const isFavorite = (pokemonId) => {
        return favorites.value.some(p => p.id === pokemonId)
    }

    return {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }
}