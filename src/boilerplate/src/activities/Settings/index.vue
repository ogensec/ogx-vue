<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslations } from '@ogen-providers/app/composables'
import type { TPanel } from '@ogen-components/BaseExpandPanels/index.vue'
import SvgCloseButton from '@ogen-components/svg/SvgCloseButton.vue'
import BaseExpandPanels from '@ogen-components/BaseExpandPanels/index.vue'
import {
  SettingsAccessibilityGraphics,
  SettingsAccessibilityLanguages,
  SettingsAccountPersInformations,
} from '@app-organizer'

import { getters as SettingsGetters } from '@activities/Settings/composable.ts'

const props = defineProps({
  onTerminate: {
    type: Function
  },
  onCancel: {
    type: Function
  },
  fromDialog: {
    type: Boolean,
    default: false
  }
})

const { PRINT, InjectLocalesMessages } = useTranslations()

InjectLocalesMessages({
  fr: {
    settings: 'Paramètres',
    my_account: 'Mon profile',
    accessibility: 'Accessibilité',
    cloud: 'Cloud',
    security: 'Sécurité',
    account_panel: {
      personal_informations: 'Informations personnelles',
      security: 'Sécurité du compte'
    },
    cloud_panel: {
      security: 'Sécurité'
    },
    accessibility_panel: {
      languages: 'Langues',
      graphics: 'Graphiques'
    }
  },
  en: {
    settings: 'Settings',
    my_account: 'My account',
    accessibility: 'Accessibility',
    cloud: 'Cloud',
    security: 'Security',
    account_panel: {
      personal_informations: 'Personal informations',
      security: 'Account security'
    },
    cloud_panel: {
      security: 'Security'
    },
    accessibility_panel: {
      languages: 'Languages',
      graphics: 'Graphics'
    }
  }
})

const onClickConfirm = () => {
  // emit('onTerminate')
  if (props.onTerminate) props.onTerminate()
}

const onClickCancel = () => {
  // emit('onCancel')
  if (props.onCancel) props.onCancel()
}

const VIEW = {
  ACCOUNT: {
    INDEX: 'my_account',
    PERSONAL_INFORMATIONS: 'account_panel.personal_informations',
    SECURITY: 'account_panel.security'
  },
  ACCESSIBILITY: {
    INDEX: 'accessibility',
    LANGUAGES: 'accessibility_panel.languages',
    GRAPHICS: 'accessibility_panel.graphics'
  },
  CLOUD: {
    INDEX: 'cloud',
    SECURITY: 'cloud_panel.security'
  }
}

const activeView = ref<null | string>(null)

const setView = (value: string) => {
  activeView.value = value
}

const components = {
  [VIEW.ACCOUNT.PERSONAL_INFORMATIONS]: SettingsAccountPersInformations,

  [VIEW.ACCESSIBILITY.LANGUAGES]: SettingsAccessibilityLanguages,
  [VIEW.ACCESSIBILITY.GRAPHICS]: SettingsAccessibilityGraphics,

}

const panels = computed(() => {
  return [
    {
      id: VIEW.ACCOUNT.INDEX,
      label: PRINT(VIEW.ACCOUNT.INDEX),
      items: [
        {
          label: PRINT(VIEW.ACCOUNT.PERSONAL_INFORMATIONS),
          onActive: () => setView(VIEW.ACCOUNT.PERSONAL_INFORMATIONS)
        },
      ]
    },
    {
      id: VIEW.ACCESSIBILITY.INDEX,
      label: PRINT(VIEW.ACCESSIBILITY.INDEX),
      items: [
        {
          label: PRINT(VIEW.ACCESSIBILITY.LANGUAGES),
          onActive: () => setView(VIEW.ACCESSIBILITY.LANGUAGES)
        },
        {
          label: PRINT(VIEW.ACCESSIBILITY.GRAPHICS),
          onActive: () => setView(VIEW.ACCESSIBILITY.GRAPHICS)
        }
      ]
    }
  ] as TPanel[]
})

const activeViewComponent = computed(() => {
  if (activeView.value) return components[activeView.value]
  else return false
})
</script>

<template>
  <div class="activity-settings">
    <div class="title-ctn">
      <div class="title">
        {{ PRINT('settings') }}
      </div>
      <template v-if="fromDialog">
        <div class="spacer" />
        <SvgCloseButton
          :size="38"
          class="button-close mr-5"
          @click="() => props.onCancel && props.onCancel()"
          style="margin-top: 8px; margin-bottom: -10px"
        />
      </template>
    </div>
    <div class="view">
      <div class="navigation">
        <BaseExpandPanels :panels-list="panels" :multiple="true" class="expand-settings" />
      </div>
      <div class="content" v-if="activeViewComponent">
        <component :is="activeViewComponent" v-bind="{ onTerminate, onCancel, userData: SettingsGetters.clientData.value }" />
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>

<style>
  @import "styles.scss";
</style>
