#!/bin/bash
set -e
set -o nounset
set -o errexit
set -o xtrace
set -o pipefail

[ ! -f "${PROJECT_CONFIG_PATH}" ] && echo "Cannot find project config in ${PROJECT_CONFIG_PATH}." && exit
[ ! -f "${TEST_CONFIG_PATH}" ] && echo "Cannot find test config in ${TEST_CONFIG_PATH}." && exit

export RUN_API_TOKEN=${!RUN_API_TOKEN_ENV_NAME}

OPTIONAL_ARGS=()
[ "$DRY_RUN" -eq 1 ] && OPTIONAL_ARGS+=("--dryRun")
[ -n "$TEST_ARGS" ] && OPTIONAL_ARGS+=("--testArgs='${TEST_ARGS}'")

testlio create-run --projectConfig "${PROJECT_CONFIG_PATH}" --testConfig "${TEST_CONFIG_PATH}" "${OPTIONAL_ARGS[@]}"
