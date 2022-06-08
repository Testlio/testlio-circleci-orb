#!/bin/bash
export RUN_API_TOKEN=${!RUN_API_TOKEN_ENV_NAME}
cd ${PROJECT_DIR} || exit
testlio create-run --projectConfig ${PROJECT_CONFIG_PATH} --testConfig ${TEST_CONFIG_PATH}
