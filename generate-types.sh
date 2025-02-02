#!/bin/bash

# Créer le dossier /bin/types s'il n'existe pas déjà
mkdir -p ./bin/types

# Copier le contenu d'un des dossiers /bin/*/types vers /bin/types
for dir in ./bin/*/types; do
  if [ -d "$dir" ]; then
    cp -r $dir/* ./bin/types/
    break
  fi
done

# Supprimer tous les dossiers /bin/*/types
for dir in ./bin/*/types; do
  if [ -d "$dir" ]; then
    rm -rf $dir
  fi
done

# Réorganiser les fichiers de types
mkdir -p ./bin/types

mv ./bin/types/index.d.ts ./bin/types/file/index.d.ts

echo "Types have been reorganized successfully."
