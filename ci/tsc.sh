#!/usr/bin/env bash

CHANGED_TS_FILES=$(git diff --name-only $TRAVIS_COMMIT_RANGE | grep -e "\.tsx" -e "\.ts")

if [ ! -z "$CHANGED_TS_FILES" ]; then
  tsc \
  --noEmit \
  --experimentalDecorators \
  --jsx react \
  --skipLibCheck \
  $CHANGED_TS_FILES
fi
