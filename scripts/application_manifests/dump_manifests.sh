#!/usr/bin/env bash

DUMP_FILE="scripts/application_manifests/applications-ids.json"
MANIFEST_FOLDER="manifests/definitions"
SERVER="http://localhost:4001"

# CREATE MANIFESTS FOLDER IF IT DOES NOT EXISTS
mkdir -p $MANIFEST_FOLDER
# GRAB ALL APPLICATIONS IDS
ids=`jq .[].id $DUMP_FILE`

# LOOP N CURL ALL MANIFESTS
for identifier in $ids
do
  curl -s "$SERVER/application-recipe/$identifier/bxAppManifest.json" > $MANIFEST_FOLDER/"$identifier"_tmp.json
  jq -s '.[0] * .[1]' $MANIFEST_FOLDER/"$identifier"_tmp.json $MANIFEST_FOLDER/"$identifier".json > $MANIFEST_FOLDER/"$identifier"_new.json
  rm $MANIFEST_FOLDER/"$identifier"_tmp.json $MANIFEST_FOLDER/"$identifier".json
  mv $MANIFEST_FOLDER/"$identifier"_new.json $MANIFEST_FOLDER/"$identifier".json
done
