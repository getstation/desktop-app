#!/usr/bin/env bash

MANIFEST_FOLDER="manifests"
ICONS_FOLDER="icons"

# CREATE ICONS FOLDER IF IT DOES NOT EXISTS
mkdir -p $ICONS_FOLDER
# GRAB ALL APPLICATIONS MANIFESTS
manifests_files=`ls $MANIFEST_FOLDER`

ids_length=`ls -1 $MANIFEST_FOLDER | wc -w`
current=1

# LOOP N CURL ALL MANIFESTS
for manifest in $manifests_files
do
  id="${manifest%.*}"
  src=`jq '.icons[] | select(.platform == "browserx") | .src' $MANIFEST_FOLDER/$manifest  | tr -d '"'`
  curl -s $src > $ICONS_FOLDER/$id.svg && echo "SAVED[$id] : $current on $ids_length"
  current=$((current + 1))
done
