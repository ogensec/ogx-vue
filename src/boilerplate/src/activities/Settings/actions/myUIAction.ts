import { actionConsole as console, states as SettingsStates } from '../composable'
type TMyUIActionArgs = {

}

export default async function MyUIAction(args: TMyUIActionArgs) {



  try {
    console.log('MyUIAction', args);
    SettingsStates.isReady = true;

  } catch (e: any) {

    console.error(e);
    return { errors: e.message }
  }
}