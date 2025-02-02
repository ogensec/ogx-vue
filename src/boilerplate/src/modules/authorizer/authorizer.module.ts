import { ModuleCore, SocketCore } from '@ogen-core'
import { nextConsole } from '@ogen-composables/helpers/useDevTools'
import type { ComputedRef, Ref } from 'vue'
import type { AxiosResponse, AxiosResponseHeaders } from 'axios'
import type { CookieRef } from '@ogen-providers/app/composables/useCookie.ts'
import { computed, ref, watch } from 'vue'
import { ROUTE_AUTH, ROUTE_HOME } from '@app-routes'
import { useAppProvider } from '@providers'
import { DefaultInstance } from '@app-axios'
import { useDevice, useCookie } from '@ogen-providers/app/composables'
import useLocalStorage from '@ogen-composables/useLocalStorage.ts'
import updateAxiosHeadersRequest from './middlewares/useAxiosHeadersRequest'
import updateAxiosHeadersResponse from './middlewares/useAxiosHeadersResponse'
import updateAxiosHeadersResponseError from './middlewares/useAxiosHeadersResponseError'


const isProduction = process.env.NODE_ENV === 'production'

export const HEADER_XDEVICE = 'x-device'
export const HEADER_XSESSION = 'x-session'


let console = nextConsole('Module[Autorizer]', { color: '#FFFFFF', background: '#980303' })

export interface IAutorizerModule {
  userData: Ref<any>
  hasCurrentSession: ComputedRef<boolean>

  tokens: {
    device: CookieRef<string | null | undefined>
    events: CookieRef<string | null | undefined>
  }
}

export default class AutorizerModule extends ModuleCore implements IAutorizerModule {
  static NAMESPACE = 'authorizer'

  public userData = useLocalStorage<any>('user', null as any)

  public tokens: {
    device: CookieRef<string | null | undefined>
    events: CookieRef<string | null | undefined>
  }

  public hasCurrentSession

  constructor() {
    console.log('Construct')
    super({ id: AutorizerModule.NAMESPACE })

    this.hasCurrentSession = computed(() => this.userData.value !== null)

    this.tokens = {
      device: useCookie('auth:xdevice', {
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: 'lax',
        domain: 'localhost'
      }),
      events: useCookie('auth:xevents', {
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: 'lax',
        domain: 'localhost'
      })
    }

    this.init().finally()
  }

  async init() {

    const {
      memory: { ram: AppRam }
    } = await useAppProvider()


    const self = this

    if (!this.tokens.device.value) {
      this.tokens.device.value = await useDevice().getUniqId()
    }


    watch(this.hasCurrentSession, (next, last) => {
      if (!last && next) {
        const redirect = AppRam.redirect.value
        window.location.href = redirect || ROUTE_HOME.path
        AppRam.redirect.value = null as any
      } else if (last && !next) {
        window.location.href = ROUTE_AUTH.path
      }
    })

    // DevNote : Only for example API.
    DefaultInstance.interceptors.request.use((config) => updateAxiosHeadersRequest(config, this), error => Promise.reject(error));
    DefaultInstance.interceptors.response.use((response: AxiosResponse<any, any>) => updateAxiosHeadersResponse(response, this),(error: AxiosResponseHeaders) => updateAxiosHeadersResponseError(error,this));

    
    this.setIsReady(true)
  }
}
