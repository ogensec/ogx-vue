<script setup lang="ts">
//
//import { faHome, faAddressBook, faCloud, faEnvelope } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
//import { ROUTE_HOME } from '@app-routes';
import performLogout from '@modules/authorizer/actions/performLogout.action.ts'
import openSettings from '@activities/Settings/actions/openSettings.ts'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGear, faRightFromBracket } from '@font-awesome-solid'
import toggleClientMenu from '@activities/App/actions/toggleClientMenu.ts'


type TPropsUserMainMenu = {
  userData: any
}

const props = defineProps<TPropsUserMainMenu>()

const onClickLogout = () =>  { performLogout(); toggleClientMenu(false) }

const onClickSettings = () => { openSettings(); toggleClientMenu(false) };

</script>

<template>
  <div ref="refMenu" class="user-menu">
    <div class="header">
      <div class="mail">{{ props.userData.email }}</div>
    </div>
    <div class="body">
      <button class="menu-button" @click="onClickSettings">
        <FontAwesomeIcon :icon="faGear" />
        <span>Settings</span>

      </button>
      <button class="menu-button logout" @click="onClickLogout">
        <FontAwesomeIcon :icon="faRightFromBracket" />
        <span>Logout</span>

      </button>
    </div>
  </div>
</template>

<style lang="scss">
.user-menu {
  position: absolute;
  width: 250px;
  right: 20px;
  display:flex;
  flex-direction: column;
  top: calc(var(--app-header-height) + 20px);
  border: 2px solid var(--primary-base);
  border-radius: 6px;

  .header {
    padding: 8px;
    height: 20px;
    background-color: var(--primary-base);
    color: var(--text-base-reverse);
    display: flex;
    justify-content: center;
    align-items: center;

    .mail {
      font-size: 12px;
      font-weight: bold;
      color: white;
    }
  }

  .body {
    background-color: white;
    color: black;
    padding: 7px;
    flex: 1;
    border-radius: 2px;

    .menu-button {
      display: inline-flex;
      width: 100%;
      height: 40px;
      align-items: center;
      border: none;
      cursor: pointer;
      margin-bottom: 5px;
      &:hover {
        background-color: var(--primary-base);
        &.logout {
          background-color: var(--error-lighten3);

        }
        svg,span {
          color: white
        }
      }
      svg {
        flex: 1;
        max-width: 35px;
      }
      span {
        flex: 1;
        text-align: left;
      }
    }


  }
}
</style>
