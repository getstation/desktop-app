#!/bin/bash

# Attach the installers built by electron-builder into `release/` to an existing
# GitHub release. Unpacked directories and source maps are skipped; existing
# assets of the same name are replaced so a release can be refreshed in place.

set -euo pipefail

tag=$1

if [[ -z "$tag" ]]; then
    echo "Error: Release tag is missing."
    echo "usage: $(basename $0) tag"
    exit 1
fi

root=$(cd "$(dirname "$0")/.." && pwd)

assets=()
while IFS= read -r -d '' file; do
    assets+=( "$file" )
done < <(find "$root/release" -maxdepth 1 -type f \
    \( -name '*.zip' -o -name '*.dmg' -o -name '*.exe' -o -name '*.AppImage' \
       -o -name '*.deb' -o -name '*.rpm' -o -name '*.blockmap' -o -name 'latest*.yml' \) \
    -print0)

if [[ ${#assets[@]} -eq 0 ]]; then
    echo "Error: No build artifacts found in $root/release."
    exit 1
fi

printf 'Uploading to %s:\n' "$tag"
printf '  %s\n' "${assets[@]##*/}"

gh release upload "$tag" "${assets[@]}" --clobber
