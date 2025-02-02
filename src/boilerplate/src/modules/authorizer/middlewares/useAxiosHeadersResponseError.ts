import AutorizerModule, { HEADER_XDEVICE  } from '../authorizer.module'
import { useModule } from '@ogen-providers/app/composables/useModules'
import type { AxiosResponseHeaders } from 'axios'

export default async function useAxiosHeadersResponseError(
  error: AxiosResponseHeaders,
  AuthModule: AutorizerModule
) {
  const response = error.response || {
    data: {
      errors: [ { code: 500, type: 'internal', message: 'Network Error' } ],
      code: 500,
      data: error.message
    }
  }
  if (response.headers) {
    if (
      response.headers[HEADER_XDEVICE] &&
      response.headers[HEADER_XDEVICE] !== AuthModule.tokens.device.value
    )
      AuthModule.tokens.device.value = response.headers[HEADER_XDEVICE]
    else if (!response.headers[HEADER_XDEVICE] && AuthModule.tokens.device.value)
      AuthModule.tokens.device.value = null
    //
    // if (
    //   response.headers[HEADER_XSESSION] &&
    //   response.headers[HEADER_XSESSION] !== AuthModule.tokens.session.value
    // ) {
    //   AuthModule.tokens.session.value = response.headers[HEADER_XSESSION]
    // } else if (!response.headers[HEADER_XSESSION] && AuthModule.tokens.session.value)
    //   AuthModule.tokens.session.value = null
    // }

    return response
  }
}