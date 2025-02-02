import AutorizerModule, {
  HEADER_XDEVICE,
} from '../authorizer.module'

export default async function useAxiosHeadersRequest(config: any, AuthModule: AutorizerModule) {

  // config.headers[HEADER_XSESSION] = AuthModule.tokens.session.value
  config.headers[HEADER_XDEVICE] = AuthModule.tokens.device.value
  // config.headers[HEADER_XEVENTS] = AuthModule.tokens.events.value
  return config
}
