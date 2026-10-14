#!/bin/bash

# Increment a version string using Semantic Versioning (SemVer) terminology.
# Supported version formats: major.minor.patch or major.minor.patch-bBUILD

usage="usage: $(basename $0) {major|minor|patch|build} major.minor.patch[-bBUILD]"

# Parse input parameter.
operation=$1
version=$2

# Validate operation input.
if [[ "$operation" != "major" && "$operation" != "minor" && "$operation" != "patch" && "$operation" != "build" ]]; then
    echo "Error: Invalid operation. Use 'major', 'minor', 'patch', or 'build'."
    echo "$usage"
    exit 1
fi

# Validate version input.
if [[ -z "$version" ]]; then
    echo "Error: Version string is missing."
    echo "$usage"
    exit 1
fi

# Validate version format and split it into parts. The build part is optional.
if [[ "$version" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)(-b([0-9]+))?$ ]]; then
    major="${BASH_REMATCH[1]}"
    minor="${BASH_REMATCH[2]}"
    patch="${BASH_REMATCH[3]}"
    build="${BASH_REMATCH[5]}"
else
    echo "Error: Version string must be in the format major.minor.patch or major.minor.patch-bBUILD."
    echo "$usage"
    exit 1
fi

# Increment version numbers as requested.
case $operation in
    major)
        ((major++))
        minor=0
        patch=0
        ;;
    minor)
        ((minor++))
        patch=0
        ;;
    patch)
        ((patch++))
        ;;
    build)
        if [[ -z "$build" ]]; then
            build=1
        else
            ((build++))
        fi
        ;;
esac

# Output the incremented version. The build number is kept for 'build' only.
if [[ "$operation" == "build" ]]; then
    echo "${major}.${minor}.${patch}-b${build}"
else
    echo "${major}.${minor}.${patch}"
fi
