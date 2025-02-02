<script setup lang="ts">
import { computed } from 'vue';
import useTranslations from '@ogen-providers/app/composables/useTranslations.ts';
import { AVAILABLE_LANGS } from '@app-constants';

const { PRINT, InjectLocalesMessages, current, set: setLanguage } = useTranslations();

InjectLocalesMessages({
  fr: {
    'languages': 'Langages',
    'select_language': 'Sélectionnez une langue',
  },
  en: {
    'languages': 'Languages',
    'select_language': 'Select a language',
  }
});

const availableLangs = AVAILABLE_LANGS;

const currentLanguage = computed(() => current.value);
const handleLanguageChange = setLanguage
</script>

<template>
  <div class="settings-access-lang">
    <div class="title">{{ PRINT('languages') }}</div>
    <div class="description">{{ PRINT('select_language') }}</div>
    <ul>
      <li
        v-for="lang in availableLangs"
        :key="lang"
        :class="{ active: lang === currentLanguage }"
        @click="handleLanguageChange(lang)"
        class="language-item"
      >
        {{ lang.toUpperCase() }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.settings-access-lang {
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

  .language-item {
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
