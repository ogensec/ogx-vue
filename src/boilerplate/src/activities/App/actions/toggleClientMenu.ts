import { states } from '@activities/App/composable.ts'

export default function toggleClientMenu(force: boolean | null = null) {
  if (!force)
    states.showMenu = !states.showMenu;
  else states.showMenu = force;
}