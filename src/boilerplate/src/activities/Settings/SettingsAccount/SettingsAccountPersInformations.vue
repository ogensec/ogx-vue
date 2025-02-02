<script setup lang="ts">
import { computed } from 'vue';
import { useModule, useTranslations } from "@ogen-providers/app/composables";
import AutorizerModule from "@modules/authorizer/authorizer.module";

type TPropsSettingsAccount = {
  userData: any,
}

const props = defineProps<TPropsSettingsAccount>()

const { PRINT, InjectLocalesMessages } = useTranslations();

InjectLocalesMessages({
  fr: {
    'personal_informations': 'Informations personnelles',
    'key': 'Clé',
    'value': 'Valeur',
  },
  'en': {
    'personal_informations': 'Personal informations',
    'key': 'Key',
    'value': 'Value',
  }
})

const computedUserData = computed(() => Object.entries(props.userData));
</script>

<template>
  <div class="settings-account-pers-informations">
    <div class="title">{{ PRINT('personal_informations') }}</div>
    <table>
      <thead>
      <tr>
        <th>{{ PRINT('key') }}</th>
        <th>{{ PRINT('value') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="[key, value] in computedUserData" :key="key">
        <td>{{ key }}</td>
        <td>{{ value }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.settings-account-pers-informations {
  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: var(--text-base);
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
      color: var(--text-base);
    }

    th {
      background-color: var(--text-base);
      font-weight: bold;
    }

    tr {
      th {
        color: var(--text-base-reverse);
      }
    }

    tr:nth-child(even) {
      background-color:var(--text-base-reverse);
    }
  }
}
</style>
