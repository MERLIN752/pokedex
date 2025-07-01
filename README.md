# Pokédex Vue 3

Une application web moderne de Pokédex développée avec Vue 3, offrant une expérience complète de navigation dans l'univers Pokémon.

## 🚀 Fonctionnalités

### ✅ Fonctionnalités implémentées
- **Liste des Pokémon** avec nom, image et types
- **Chargement progressif** (lazy loading) avec pagination automatique
- **Recherche avancée** :
  - Par nom (recherche partielle)
  - Par type (jusqu'à 2 types simultanés)
  - Par génération (1 à 9)
- **Paramètres URL** : tous les filtres sont reflétés dans l'URL
- **Page de détails** complète pour chaque Pokémon :
  - Informations générales (taille, poids, génération)
  - Types avec couleurs distinctives
  - Statistiques avec barres visuelles
  - Description officielle
  - Chaîne d'évolution interactive
- **Système de favoris** avec stockage local persistant
- **Navigation des évolutions** avec liens vers la famille
- **Design responsive** adapté mobile et desktop
- **Interface moderne** inspirée du Pokédex officiel

### 🎯 Technologies utilisées
- **Vue 3** avec Composition API
- **Vue Router 4** pour la navigation
- **API REST** PokéAPI officielle
- **CSS moderne** avec animations et effets
- **LocalStorage** pour la persistance des favoris
- **Responsive design** avec CSS Grid et Flexbox

## 📦 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/pokedex-vue3.git
cd pokedex-vue3
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Lancer en mode développement**
```bash
npm run dev
# ou
yarn dev
```

4. **Construire pour la production**
```bash
npm run build
# ou
yarn build
```

5. **Prévisualiser la build de production**
```bash
npm run preview
# ou
yarn preview
```

## 🗂️ Structure du projet

```
src/
├── components/
│   ├── PokemonList.vue      # Liste principale avec filtres
│   ├── PokemonDetail.vue    # Page de détails d'un Pokémon
│   └── Favorites.vue        # Page des favoris
├── composables/
│   ├── usePokemonApi.js     # API calls vers PokéAPI
│   └── useFavorites.js      # Gestion des favoris
├── App.vue                  # Composant racine avec navigation
└── main.js                  # Point d'entrée de l'application
```

## 🎮 Utilisation

### Navigation principale
- **Accueil** (`/`) : Liste des Pokémon avec filtres
- **Détails** (`/pokemon/:id`) : Page détaillée d'un Pokémon
- **Favoris** (`/favorites`) : Collection de vos Pokémon favoris

### Filtres et recherche
- **Nom** : Recherche en temps réel par nom
- **Types** : Sélection jusqu'à 2 types simultanés
- **Génération** : Filtrage par génération (1-9)
- **URL** : Tous les filtres sont sauvegardés dans l'URL

### Fonctionnalités avancées
- **Chargement automatique** : Scroll infini pour charger plus de Pokémon
- **Favoris persistants** : Vos favoris sont sauvegardés localement
- **Navigation d'évolutions** : Liens directs vers les évolutions
- **Recherche de famille** : Voir tous les Pokémon d'une famille d'évolution

## 🔧 Configuration

### Variables d'environnement
Aucune configuration particulière requise. L'application utilise l'API publique PokéAPI.

### Personnalisation
- Modifiez les couleurs dans les fichiers CSS
- Ajustez le nombre de Pokémon chargés par page dans `usePokemonApi.js`
- Personnalisez les filtres dans `PokemonList.vue`

## 🌐 API utilisée

**PokéAPI** (https://pokeapi.co/)
- Données complètes sur tous les Pokémon
- Images haute qualité
- Informations sur les types, stats, évolutions
- API gratuite et sans limitation

## 📱 Responsive Design

L'application est entièrement responsive :
- **Desktop** : Grille adaptative avec sidebar de filtres
- **Tablet** : Layout optimisé pour tablettes
- **Mobile** : Interface tactile avec navigation simplifiée

## 🚀 Déploiement

### Netlify (recommandé)
1. Build du projet : `npm run build`
2. Déployez le dossier `dist/`
3. Configurez les redirections pour le SPA

### Vercel
1. Connectez votre repository GitHub
2. Vercel détecte automatiquement Vue.js
3. Deploy automatique à chaque push

### GitHub Pages
1. Build : `npm run build`
2. Déployez le contenu de `dist/` sur la branche `gh-pages`

## 🐛 Dépannage

### Problèmes courants
- **Images qui ne chargent pas** : Vérifiez votre connexion internet
- **Filtres qui ne fonctionnent pas** : Videz le cache du navigateur
- **Favoris perdus** : Vérifiez que le localStorage est activé

### Performance
- Les images sont optimisées avec lazy loading
- Le chargement progressif évite les gros téléchargements
- Les requêtes API sont mises en cache côté navigateur

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork du projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

Projet sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **PokéAPI** pour l'API complète et gratuite
- **The Pokémon Company** pour l'univers Pokémon
- **Vue.js team** pour le framework fantastique 
