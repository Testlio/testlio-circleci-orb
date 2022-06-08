#!/bin/bash
set -e
set -o nounset
set -o errexit
set -o xtrace

export RUN_API_TOKEN=${!RUN_API_TOKEN_ENV_NAME}
cd ${PROJECT_DIR} || exit
testlio create-run --projectConfig ./test --testConfig ${TEST_CONFIG_PATH}
