import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import PokemonList from './components/PokemonList.vue'
import PokemonDetail from './components/PokemonDetail.vue'
import Favorites from './components/Favorites.vue'

const routes = [
    { path: '/', component: PokemonList, props: route => ({ ...route.query }) },
    { path: '/pokemon/:id', component: PokemonDetail, props: true },
    { path: '/favorites', component: Favorites },
    {
        path: '/evolution-chain/:id',
        component: PokemonList
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')