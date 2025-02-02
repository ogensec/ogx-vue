<script lang="ts" setup async>
import { onMounted, ref } from 'vue'
import { injectLocalesMessages } from '@ogen-core'
import { useAppProvider } from "@providers";
import { useModule, useRouter, useTranslations } from '@ogen-providers/app/composables'
import { ROUTE_AUTH_CALLBACK } from '@app-routes'
import getUserData from '@modules/authorizer/actions/getClientData.action'
import AutorizerModule, { type IAutorizerModule } from '@modules/authorizer/authorizer.module'

const { router, route } = useRouter();
// const { current: currentTheme, set: changeTheme } = useThemes();

injectLocalesMessages({
  fr: {
    "login_button": "Connexion",
    "retrieving_data": "Récupération de votre profil...",
  },
  en: {
    "login_button": "Login",
    "retrieving_data": "Retrieving your profil's data...",

  }
})

const Autorizer = useModule<IAutorizerModule>(AutorizerModule.NAMESPACE) as IAutorizerModule;
const { PRINT } = useTranslations();


const redirectUri = `${window.location.origin}/auth/callback`
const link = `${window.env.VITE_BACKEND_URL}/auth/sso/login/okta?redirect_uri=${redirectUri}`

const isLoading = ref(false);
let isCallback = false;

const onClickConnect = () => {
  isLoading.value = true;
  window.location.href = link
}

if (route.name === ROUTE_AUTH_CALLBACK.name)
  isCallback = true;



onMounted(() => {
  if (route.name === ROUTE_AUTH_CALLBACK.name && !Autorizer.hasCurrentSession)
    getUserData();

})

</script>

<template>
	<div class="activity-auth">
		<div class="main-box min-w-250 max-w-100p">
      <LogoMain />
      <BaseButton
        v-if="!isCallback"
        class="ogen-button"
        :loading="isLoading"
        :disabled="isLoading"
        @click="() => onClickConnect()"
      >
        {{ PRINT('login_button') }}
      </BaseButton>
      <div v-else class="text-small">
        {{ PRINT('retrieving_data') }}
      </div>
		</div>
	</div>
</template>

<style lang="scss">

.activity-auth {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--text-base);
  background-color: var(--background-base);

  .main-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    .ogen-button {
      //extends from @assets/scss/components.scss
      margin-top: 15px;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      text-decoration: none;
      color: var(--text-base-reverse);
    }

    .text-small {
      margin-top: 10px;
      font-size: 12px;
    }
  }

	//.line-error {
	//	background-color: var(--error-base);
	//	color: var(--text-base);
	//	font-weight: 800;
	//	font-size: 12px;
	//	padding: 3px 5px 3px 5px;
	//	border-radius: 8px;
	//	margin-top: 2px;
	//}

}
</style>
