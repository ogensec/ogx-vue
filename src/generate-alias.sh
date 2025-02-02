#!/bin/bash

SCOPE="@ogen-technologies"
FRAMEWORK_NAME="ogen-vue"
FULL_PKG_NAME="$SCOPE/$FRAMEWORK_NAME"

# Fichiers de sortie pour Vite et TypeScript
VITE_OUTPUT="vite.aliases.ts"
TSCONFIG_OUTPUT="tsconfig.app.json"

# Base directory
BASE_DIR="./src/providers"

# Générer les alias pour Vite
generate_vite_aliases() {
  echo "• Generating vite aliases... "

  cat <<EOL > $VITE_OUTPUT
import { fileURLToPath, URL } from 'node:url';

export const alias = {
EOL

  # Alias par défaut
  cat <<EOL >> $VITE_OUTPUT
  '@': fileURLToPath(new URL('./src', import.meta.url)),
  '@ogen-core': fileURLToPath(new URL('./node_modules/$FULL_PKG_NAME/bin/vue/core/index.ts', import.meta.url)),
  '@ogen-providers': fileURLToPath(new URL('./node_modules/$FULL_PKG_NAME/bin/vue/providers', import.meta.url)),
  '@ogen-components': fileURLToPath(new URL('./node_modules/$FULL_PKG_NAME/bin/vue/components', import.meta.url)),
  '@ogen-plugins': fileURLToPath(new URL('./node_modules/$FULL_PKG_NAME/bin/vue/plugins', import.meta.url)),
  '@ogen-composables': fileURLToPath(new URL('./node_modules/$FULL_PKG_NAME/bin/vue/composables', import.meta.url)),
  '@ogen-directives': fileURLToPath(new URL('./node_modules/$FULL_PKG_NAME/bin/vue/directives', import.meta.url)),
  '@ogen-assets': fileURLToPath(new URL('./node_modules/$FULL_PKG_NAME/bin/vue/assets', import.meta.url)),
  '@ogen-workers': fileURLToPath(new URL('./node_modules/$FULL_PKG_NAME/bin/vue/workers', import.meta.url)),
  '@app-axios': fileURLToPath(new URL('./src/app.axios.ts', import.meta.url)),
  '@app-constants': fileURLToPath(new URL('./src/app.constants.ts', import.meta.url)),
  '@app-organizer': fileURLToPath(new URL('./src/app.organizer.ts', import.meta.url)),
  '@app-router': fileURLToPath(new URL('./src/app.router.ts', import.meta.url)),
  '@app-routes': fileURLToPath(new URL('./src/app.routes.ts', import.meta.url)),
  '@app-config': fileURLToPath(new URL('./src/app.config.ts', import.meta.url)),
  '@app-workers': fileURLToPath(new URL('./src/app.workers.ts', import.meta.url)),
  '@activities': fileURLToPath(new URL('./src/activities', import.meta.url)),
  '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
  '@components-shared': fileURLToPath(new URL('./src/components/shared', import.meta.url)),
  '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
  '@composables-helpers': fileURLToPath(new URL('./src/composables/helpers', import.meta.url)),
  '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
  '@directives': fileURLToPath(new URL('./src/directives', import.meta.url)),
  '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
  '@middlewares': fileURLToPath(new URL('./src/middlewares', import.meta.url)),
  '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
  '@providers': fileURLToPath(new URL('./src/app.providers.ts', import.meta.url)),
  '@open-api': fileURLToPath(new URL('./src/plugins/open-api/index.ts', import.meta.url)),
  '@font-awesome-solid': fileURLToPath(new URL('./node_modules/@fortawesome/free-solid-svg-icons', import.meta.url)),
  '@font-awesome-brands': fileURLToPath(new URL('./node_modules/@fortawesome/free-brands-svg-icons', import.meta.url)),
  '@font-awesome-regular': fileURLToPath(new URL('./node_modules/@fortawesome/free-regular-svg-icons', import.meta.url)),
EOL

  # Alias dynamiques pour les sous-dossiers de /src/providers
  if [ -d "$BASE_DIR" ]; then
    for dir in "$BASE_DIR"/*/; do
      dir_name=$(basename "$dir")
      echo "  '@provider-$dir_name': fileURLToPath(new URL('./src/providers/$dir_name', import.meta.url))," >> $VITE_OUTPUT
      echo "  '@provider-$dir_name/composables': fileURLToPath(new URL('./src/providers/$dir_name/composables', import.meta.url))," >> $VITE_OUTPUT
      echo "  '@provider-$dir_name/actions': fileURLToPath(new URL('./src/providers/$dir_name/$dir_name.actions.ts', import.meta.url))," >> $VITE_OUTPUT
      echo "  '@provider-$dir_name/memory': fileURLToPath(new URL('./src/providers/$dir_name/$dir_name.memory.ts', import.meta.url))," >> $VITE_OUTPUT
    done
  fi

  echo "};" >> $VITE_OUTPUT
  echo "✔ Aliases for vite.config.ts has been generated in : $VITE_OUTPUT"
}

# Générer les alias pour TypeScript
generate_tsconfig_aliases() {
  echo "• Generating tsconfig aliases... "
  cat <<EOL > $TSCONFIG_OUTPUT
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.{vue,ts}"],
  "exclude": ["src/**/__tests__/*", "./cli/templates/**","./cli/templates/**/*"],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
EOL

  # Alias par défaut
  cat <<EOL >> $TSCONFIG_OUTPUT
      "@/*": ["./src/*"],
      "@ogen-core": ["./node_modules/$FULL_PKG_NAME/bin/vue/core/index.ts"],
      "@ogen-providers/*": ["./node_modules/$FULL_PKG_NAME/bin/vue/providers/*"],
      "@ogen-components/*": ["./node_modules/$FULL_PKG_NAME/bin/vue/components/*"],
      "@ogen-composables/*": ["./node_modules/$FULL_PKG_NAME/bin/vue/composables/*"],
      "@ogen-plugins/*": ["./node_modules/$FULL_PKG_NAME/bin/vue/plugins/*"],
      "@ogen-directives/*": ["./node_modules/$FULL_PKG_NAME/bin/vue/directives/*"],
      "@ogen-assets/*": ["./node_modules/$FULL_PKG_NAME/bin/vue/assets/*"],
      "@ogen-workers/*": ["./node_modules/$FULL_PKG_NAME/bin/vue/workers/*"],
      "@app-axios": ["./src/app.axios.ts"],
      "@app-constants": ["./src/app.constants.ts"],
      "@app-organizer": ["./src/app.organizer.ts"],
      "@app-router": ["./src/app.router.ts"],
      "@app-routes": ["./src/app.routes.ts"],
      "@app-config": ["./src/app.config.ts"],
      "@app-workers": ["./src/app.workers.ts"],
      "@activities/*": ["./src/activities/*"],
      "@assets/*": ["./src/assets/*"],
      "@components-shared/*": ["./src/components/shared/*"],
      "@components/*": ["./src/components/*"],
      "@composables-helpers/*": ["./src/composables/helpers/*"],
      "@composables/*": ["./src/composables/*"],
      "@directives/*": ["./src/directives/*"],
      "@layouts/*": ["./src/layouts/*"],
      "@middlewares/*": ["./src/middlewares/*"],
      "@modules/*": ["./src/modules/*"],
      "@providers": ["./src/app.providers.ts"],
      "@open-api": ["./src/plugins/open-api/index.ts"],
      "@font-awesome-solid": ["./node_modules/@fortawesome/free-solid-svg-icons"],
      "@font-awesome-brands": ["./node_modules/@fortawesome/free-brands-svg-icons"],
      "@font-awesome-regular": ["./node_modules/@fortawesome/free-regular-svg-icons"],
EOL

  # Alias dynamiques pour les sous-dossiers de /src/providers
  if [ -d "$BASE_DIR" ]; then
    for dir in "$BASE_DIR"/*/; do
      dir_name=$(basename "$dir")
      echo "      \"@provider-$dir_name/*\": [\"./src/providers/$dir_name/*\"]," >> $TSCONFIG_OUTPUT
      echo "      \"@provider-$dir_name/composables\": [\"./src/providers/$dir_name/composables\"]," >> $TSCONFIG_OUTPUT
      echo "      \"@provider-$dir_name/actions\": [\"./src/providers/$dir_name/$dir_name.actions.ts\"]," >> $TSCONFIG_OUTPUT
      echo "      \"@provider-$dir_name/memory\": [\"./src/providers/$dir_name/$dir_name.memory.ts\"]," >> $TSCONFIG_OUTPUT
    done
  fi

  echo "    }" >> $TSCONFIG_OUTPUT
  echo "  }" >> $TSCONFIG_OUTPUT
  echo "}" >> $TSCONFIG_OUTPUT
  echo "✔ Aliases for tsconfig has been generated in : $TSCONFIG_OUTPUT"
}

# Exécuter les fonctions
generate_vite_aliases
generate_tsconfig_aliases
