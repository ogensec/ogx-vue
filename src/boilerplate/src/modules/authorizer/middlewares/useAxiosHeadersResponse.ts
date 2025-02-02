import AutorizerModule, { HEADER_XSESSION, HEADER_XDEVICE } from "../authorizer.module"
import { useModule } from "@ogen-providers/app/composables/useModules";
import type { AxiosResponse, AxiosResponseHeaders } from "axios";

export default async function useAxiosHeadersResponse(response: AxiosResponse<any, any>, AuthModule: AutorizerModule) {

  if (response.headers[HEADER_XDEVICE] && response.headers[HEADER_XDEVICE] !== AuthModule.tokens.device.value) {
    AuthModule.tokens.device.value = response.headers[HEADER_XDEVICE];
  }
  else if (!response.headers[HEADER_XDEVICE] && AuthModule.tokens.device.value) AuthModule.tokens.device.value = null
  //
  // if (response.headers[HEADER_XSESSION]) {
  //   if (response.headers[HEADER_XSESSION] !== AuthModule.tokens.session.value)
  //     AuthModule.tokens.session.value = response.headers[HEADER_XSESSION]
  // }
  // else if (!response.headers[HEADER_XSESSION] && AuthModule.tokens.session.value) AuthModule.tokens.session.value =  null


  return response;
}