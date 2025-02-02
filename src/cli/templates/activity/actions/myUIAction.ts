import { actionConsole as console, states as {{EntityName}}States } from '../composable'
type TMyUIActionArgs = {

}

export default async function MyUIAction(args: TMyUIActionArgs) {



  try {
    console.log('MyUIAction', args);
    {{EntityName}}States.isReady = true;

  } catch (e: any) {

    console.error(e);
    return { errors: e.message }
  }
}