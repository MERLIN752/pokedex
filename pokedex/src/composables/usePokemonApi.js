export function usePokemonApi() {
    const BASE_URL = 'https://pokeapi.co/api/v2'

    const fetchPokemonList = async (limit = 20, offset = 0) => {
        const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
        const data = await response.json()

        const promises = data.results.map(async (pokemon) => {
            const id = pokemon.url.split('/').slice(-2, -1)[0]
            const res = await fetch(pokemon.url)
            const details = await res.json()

            return {
                id: parseInt(id),
                name: pokemon.name,
                image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
                types: details.types.map(t => t.type.name), // ✅ doit exister
                generation: getGeneration(parseInt(id)) // ✅ doit exister
            }
        })

        return {
            results: await Promise.all(promises),
            hasMore: data.next !== null,
            total: data.count
        }
    }

    const fetchPokemonDetails = async (id) => {
        const [pokemonRes, speciesRes] = await Promise.all([
            fetch(`${BASE_URL}/pokemon/${id}`),
            fetch(`${BASE_URL}/pokemon-species/${id}`)
        ])

        const pokemon = await pokemonRes.json()
        const species = await speciesRes.json()

        // Récupérer la chaîne d'évolution
        let evolutionChain = []
        if (species.evolution_chain) {
            const evolutionRes = await fetch(species.evolution_chain.url)
            const evolutionData = await evolutionRes.json()
            evolutionChain = parseEvolutionChain(evolutionData.chain)
        }

        return {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
            types: pokemon.types.map(t => t.type.name),
            stats: pokemon.stats.map(s => ({
                name: s.stat.name,
                value: s.base_stat
            })),
            height: pokemon.height,
            weight: pokemon.weight,
            description: species.flavor_text_entries
                    .find(entry => entry.language.name === 'fr')?.flavor_text ||
                species.flavor_text_entries
                    .find(entry => entry.language.name === 'en')?.flavor_text || '',
            generation: getGeneration(pokemon.id),
            evolutionChain
        }
    }

    const searchPokemon = async (query) => {
        try {
            const response = await fetch(`${BASE_URL}/pokemon/${query.toLowerCase()}`)
            if (!response.ok) return null

            const pokemon = await response.json()
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
                types: pokemon.types.map(t => t.type.name),
                generation: getGeneration(pokemon.id)
            }
        } catch {
            return null
        }
    }

    const fetchTypes = async () => {
        const response = await fetch(`${BASE_URL}/type`)
        const data = await response.json()
        return data.results
            .map(type => type.name)
            .filter(name => !['stellar', 'unknown'].includes(name))
    }

    return {
        fetchPokemonList,
        fetchPokemonDetails,
        searchPokemon,
        fetchTypes
    }
}

function getGeneration(id) {
    if (id <= 151) return 1
    if (id <= 251) return 2
    if (id <= 386) return 3
    if (id <= 493) return 4
    if (id <= 649) return 5
    if (id <= 721) return 6
    if (id <= 809) return 7
    if (id <= 905) return 8
    return 9
}

function parseEvolutionChain(chain) {
    const evolutions = []

    const traverse = (node) => {
        evolutions.push({
            id: parseInt(node.species.url.split('/').slice(-2, -1)[0]), // 🔧 important : convertir en nombre
            name: node.species.name
        })
        node.evolves_to.forEach(traverse)
    }

    traverse(chain)
    return evolutions
}