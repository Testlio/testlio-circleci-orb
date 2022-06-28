#!/bin/bash
set -e
set -o nounset
set -o errexit
set -o xtrace

[ ! -f "${PROJECT_CONFIG_PATH}" ] && echo "Cannot find project config in ${PROJECT_CONFIG_PATH}." && exit
[ ! -f "${TEST_CONFIG_PATH}" ] && echo "Cannot find test config in ${TEST_CONFIG_PATH}." && exit

export RUN_API_TOKEN=${!RUN_API_TOKEN_ENV_NAME}

if [ "$DRY_RUN" -eq 1 ] ; then
    testlio create-run --dryRun --projectConfig ${PROJECT_CONFIG_PATH} --testConfig ${TEST_CONFIG_PATH}
else
    testlio create-run --projectConfig ${PROJECT_CONFIG_PATH} --testConfig ${TEST_CONFIG_PATH}
fi
