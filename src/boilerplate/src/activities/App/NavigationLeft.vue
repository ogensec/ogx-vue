<script setup lang="ts">
import { faHome, faCloud } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from '@ogen-providers/app/composables'

// Exceptions : Routes à exclure
const EXCLUDED_ROUTES = ['Auth', 'Error', 'NotFound']

// Icônes pour les routes spécifiques
const ICON_MAP: Record<string, any> = {
  Home: faHome,
  Cloud: faCloud
}

const { router } = useRouter()

// Génération des liens dynamiquement
const links = router.options.routes
  .filter((route) => !EXCLUDED_ROUTES.includes(route.name as string)) // Exclure les routes d'erreur
  .map((route) => ({
    name: route.name,
    path: route.path,
    icon: ICON_MAP[route.name as string] || faHome // Icône par défaut si non défini
  }))
</script>

<template>
  <div class="app-navigation-left">
    <nav>
      <ul>
        <li v-for="link in links" :key="link.name">
          <router-link :to="link.path" class="nav-link">
            <FontAwesomeIcon :icon="link.icon" />
            <div>{{ link.name }}</div>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
