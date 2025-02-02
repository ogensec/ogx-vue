#!/bin/bash

# Variables
SRC_DIR="./src"
OUTPUT_DIR="./bin"
OUTPUT_FILE="$OUTPUT_DIR/index.mjs"

# Assure-toi que le dossier bin existe
mkdir -p "$OUTPUT_DIR"

# Supprime le fichier index.mjs s'il existe déjà
if [ -f "$OUTPUT_FILE" ]; then
  rm "$OUTPUT_FILE"
fi


# Parcours les fichiers dans le dossier src et ajoute des réexportations à index.mjs
for file in "$SRC_DIR"/*.ts; do
  filename=$(basename -- "$file")
  filename_no_ext="${filename%.*}"
  if [ "$filename_no_ext" != "index" ]; then
    echo "export * from './$filename_no_ext.js';" >> "$OUTPUT_FILE"
  fi
done

echo "File $OUTPUT_FILE successfully created."

# Affiche le contenu du fichier index.mjs pour vérification
cat "$OUTPUT_FILE"