<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useThemes } from '@ogen-providers/app/composables'
import { faMagnifyingGlass, faBars, faCircleHalfStroke } from '@font-awesome-solid'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import UserMainMenu from '@activities/App/UserMainMenu.vue'
import { refs, states as AppStates, getters as AppGetters } from '@activities/App/composable'
import toggleClientMenu from '@activities/App/actions/toggleClientMenu'

const { current: currentTheme, set: setTheme } = useThemes()

onClickOutside(refs.menu, (event) => {
  if (!AppStates.showMenu) return

  const target = event?.target

  if (target instanceof Element) {
    const classList = [...target.classList]
    const ignoreDivs = [
      'btn-menu',
      'ot-icon-btn',
      'v-list-item__title',
      'v-list-item__content',
      'v-list-item',
      'v-list-item--link'
    ]

    if (!ignoreDivs.some((className) => classList.includes(className))) {
      toggleClientMenu(false)
    }
  } else {
    console.warn('Event target is not a valid Element:', target)
    toggleClientMenu(false)
  }
})

const toggleTheme = () => {
  if (currentTheme.value === 'dark') setTheme('light')
  else setTheme('dark')
}
</script>

<template>
  <div class="app-header">
    <div class="ctn-logo">
      <LogoMain :maxWidth="'30px'" />
      <div class="title">OGEN Boilerplate</div>
    </div>
    <div class="ctn-center">
      <div class="search-bar">
        <FontAwesomeIcon :icon="faMagnifyingGlass" />
        <input type="text" />
      </div>
    </div>
    <div class="ctn-menu">
      <div
        class="btn-menu contrast"
        :class="{ active: currentTheme === 'dark' }"
        @click="toggleTheme"
      >
        <FontAwesomeIcon :icon="faCircleHalfStroke" />
      </div>
      <div
        class="btn-menu"
        @click="() => toggleClientMenu()"
        :class="{ active: AppStates.showMenu }"
      >
        <FontAwesomeIcon :icon="faBars" />
      </div>
    </div>
    <transition name="fade-in-bottom">
      <UserMainMenu
        :ref="(el: any) => ((refs.menu.value as any) = el)"
        v-if="AppStates.showMenu && AppGetters.clientData.value"
        :user-data="AppGetters.clientData.value"
      />
    </transition>
  </div>
</template>

<style lang="scss">
.app-header {
  position: relative;

  .ctn-logo {
    display: flex;
    gap: 10px;
    flex: 1;
    max-width: 150px;
    align-items: center;

    .title {
      font-family: var(--font-default);
      font-size: 14px;
      font-weight: 800;
      color: white;
    }
  }

  .ctn-center {
    flex: 1;
    justify-content: center;
    display: flex;

    .search-bar {
      display: flex;
      align-items: center;
      min-width: 350px;
      max-width: 500px;
      gap: 5px;
      background-color: var(--text-base-reverse);
      border: 1px solid var(--black-lighten7);
      padding: 8px;
      border-radius: 20px;

      svg {
        color: var(--primary-lighten3);
        padding-left: 3px;
      }

      input {
        border: 0;
        background: none;
        color: var(--black-lighten3);
      }
    }
  }

  .ctn-menu {
    flex: 1;
    max-width: 100px;
    padding-right: 5px;
    flex-direction: row;
    display: flex;

    .btn-menu {
      border: 2px solid var(--text-base-reverse);
      border-radius: 4px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 35px;
      width: 35px;
      transition: background-color 0.25s linear;
      cursor: pointer;

      svg {
        color: var(--text-base-reverse);
        transition: color 0.25s linear;
      }

      &:hover,
      &.active {
        background-color: var(--text-base-reverse);

        svg {
          color: var(--primary-base);
        }
      }
    }

    .btn-menu.contrast {
      margin-right: 5px;
    }
  }
}

.dark {
  .app-header {
    .ctn-center {
    }
      .ctn-menu {
        .btn-menu {
          border-color: var(--black-lighten2);
          svg {
            color: var(--black-lighten2);
          }
        }

    }
  }
}
</style>
