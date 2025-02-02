<script setup lang="ts" async>
import { computed, onMounted, ref, watch } from 'vue'

import { ROUTE_ERROR, ROUTE_HOME } from '@app-routes'
import { useMeta, useLayout, useMiddlewares, useTranslations } from '@ogen-providers/app/composables'
import { useRouter, useRoute } from "vue-router";
import { declareModule, useModule, getters } from '@ogen-providers/app/composables/useModules'
import { useAppProvider } from '@providers'
import type { IAutorizerModule } from '@modules/authorizer/authorizer.module'
import AutorizerModule from '@modules/authorizer/authorizer.module'
import SocketModule from '@modules/socket-main/socket-main.module'

import Layout from '@components/Layout.vue';
import Loader from '@components/Loader.vue'


let countNavigation = 0

const AppProvider = await useAppProvider();

const { PRINT, InjectLocalesMessages } = useTranslations()

InjectLocalesMessages({
  fr: {
    loading_router: 'Chargement du manageur et du routeur',
    loading_view: 'Chargement de la vue...'
  },
  en: {
    loading_router: 'Loading  manager and router',
    loading_view: 'Loading view...'
  }
})


const route = useRoute();
const router = useRouter();

const isFirstRequest = ref(true)
const isRouterReady = ref(false)

/**
 * Modules Declarations
 */
const Authorizer = declareModule<IAutorizerModule>({
  id: AutorizerModule.NAMESPACE,
  condition: computed(() => true),
  module: () => new AutorizerModule()
})

//DevNote: le serveur socket n'est pas dispo actuellement, mais le module se lance
// automatiquement dès que l'utlisateur est connecté.
const SocketMain = declareModule({
  id: SocketModule.NAMESPACE,
  condition: computed(() => Authorizer.hasCurrentSession),
  module: () =>
      new SocketModule({
        host: 'ws://ws.ogen.io'
      })
})

/*********************************************/


const parentMatched = computed(() => {
  return route.path !== ROUTE_HOME.path ? route?.matched[0] : route
})

const componentKey = computed(() => {
  if (parentMatched?.value?.name === ROUTE_HOME.name) return parentMatched.value.name
  else return parentMatched.value?.name || route.name
})

const getLayoutFromRouteTree = (matchedRoutes: any) => {
  let layout = null;
  for (const route of matchedRoutes) {
    if (route.meta?.layout) {
      layout = route.meta.layout;
    }
  }
  return layout;
};
const isModulesManagerReady = computed(() => !getters.isLoading.value)

const loadingMessage = computed(() => getters.loadingMessage.value || PRINT('loading_router'))

// const isModuleSocketReady = computed(() => (useModules(SocketModule.NAMESPACE) as ModuleCore).isReady)

const terminateRouterLoad = () => {
  if (!isRouterReady.value) isRouterReady.value = true
}
const terminateFirstRequest = () => {
  if (!isFirstRequest.value) isFirstRequest.value = true
}

await router.isReady()

// Setup Meta from router
router.beforeEach(async (to, from, next) => {
  countNavigation++
  if (countNavigation > 1) terminateFirstRequest()

  const goToNext = (to?: any) => {
    if (to) {
      next(to)
    } else {
      next()
    }
  }

  let matched: any = to.matched[to.matched.length - 1] || to

  if (!matched) matched = to.matched[0] || null

  //Redirect to 404 if not found.
  if (!matched) return goToNext({ name: ROUTE_ERROR.name, params: { id: '404' } })

  // Set meta from router
  if (matched?.meta?.tags) useMeta(matched.meta.tags)

  if (matched?.meta?.layout) useLayout(getLayoutFromRouteTree(Array.isArray(matched) ? matched : [matched])).finally()

  // Execute middlewares from router
  if (matched?.meta?.middlewares) {
    const nextMiddlewares = await useMiddlewares({
      middlewares: matched.meta.middlewares
    })
    if (nextMiddlewares) return goToNext(nextMiddlewares)
    else return goToNext()
  } else return goToNext()
})


if (!parentMatched.value) {
  router.push({ name: ROUTE_ERROR.name, params: { id: '404' } }).finally()
}

if (route?.meta?.layout) useLayout(getLayoutFromRouteTree([route])).finally()
if (route?.meta?.tags) useMeta(route.meta.tags)
if (route?.meta?.middlewares) {
  const nextMiddlewares = await useMiddlewares({
    middlewares: route.meta.middlewares
  })
  if (nextMiddlewares) {
    router.push(nextMiddlewares);
  } else {
    terminateRouterLoad()
    terminateFirstRequest()
  }
} else {
  terminateRouterLoad()
  terminateFirstRequest()
}


watch(
    () => route.matched[0]?.components?.default,
    (next) => {
      if (next) terminateRouterLoad()
    }
)

onMounted(() => {
  document.body.classList.remove('preload')
})
</script>

<template>
  <!--	<div class="console" style="color: white"> {{  isRouterReady }} {{  isModulesManagerReady }}</div>-->
  <router-view v-slot="{ Component }" v-if="isRouterReady && isModulesManagerReady">
    <suspense timeout="0">
      <template #default class="router-view">
        <Layout>
          <component :is="Component" :key="componentKey" />
        </Layout>

      </template>
      <template #fallback>
        <Loader
            class="d-flex justify-center flex-column h-100 w-100 align-center"
            :message="PRINT('loading_view')"
        />
      </template>
    </suspense>
  </router-view>
  <Loader
      v-else
      class="d-flex justify-center align-center flex-column w-100 h-100"
      :message="`${loadingMessage} ...`"
  />
</template>

<!----------------------
      Styles
----------------------->
<style lang="scss">
.router-view {
  display: flex;
  flex: 1;
}

.console {
  background-color: blue;
  color: white;
  position: absolute;
  display: inline-block;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  bottom: 0;
  resize: block;
}
</style>
