<script setup lang="ts">
import { computed } from 'vue'
import { AVAILABLE_GRAPHICS, AVAILABLE_THEMES} from '@app-constants'
import { useTranslations, useThemes, useGraphicModes } from '@ogen-providers/app/composables'


const { PRINT, InjectLocalesMessages } = useTranslations()
const { current: currentGraphic, currentName: currentGraphicName, set: setGraphic } = useGraphicModes()
const { current: currentTheme, set: setTheme } = useThemes()

InjectLocalesMessages({
  fr: {
    graphics: 'Graphiques',
    select_graphic_mode: 'Sélectionnez un mode graphique',
    select_contrast_mode: 'Sélectionnez le contraste'
  },
  en: {
    graphics: 'Graphics',
    select_graphic_mode: 'Select a graphic mode',
    select_contrast_mode: 'Select contrast mode'

  }
})

const handleGraphicChange = setGraphic
const handleContrastChange = () => {
  if (currentTheme.value === 'dark') setTheme('light')
  else setTheme('dark')
}

</script>

<template>
  <div class="settings-access-graphic">
    <div class="title">{{ PRINT('graphics') }}</div>
    <div class="description">{{ PRINT('select_graphic_mode') }}</div>
    <ul>
      <li
        v-for="mode in AVAILABLE_GRAPHICS"
        :key="mode.label"
        :class="{ active: mode.label === currentGraphicName }"
        @click="handleGraphicChange(mode.value)"
        class="graphic-item"
      >
        {{ mode.label.toUpperCase() }}
      </li>
    </ul>

    <div class="description" style="margin-top: 20px">{{ PRINT('select_contrast_mode') }}</div>
    <ul>
      <li
        v-for="mode in Object.values(AVAILABLE_THEMES)"
        :key="mode"
        :class="{ active: mode === currentTheme }"
        @click="handleContrastChange"
        class="graphic-item"
      >
        {{ mode.toUpperCase() }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.settings-access-graphic {
  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: white;
  }

  .description {
    margin-bottom: 10px;
    color: #555;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .graphic-item {
    cursor: pointer;
    padding: 10px 15px;
    margin-bottom: 5px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    font-weight: 500;
    width: 200px;
    background-color: #555;
    border: 2px solid rgba(0,0,0,0);
    &:hover {
      border: 2px solid #007bff;
    }

    .dark  & {
      background-color: #f0f0f0;
    }
    .light & {
      background-color: #f0f0f0;
    }
    &.active {
        background-color: #007bff;

      color: white;
    }
  }
}
</style>
