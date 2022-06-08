#!/bin/bash
ls
cd ${PROJECT_DIR} || exit
testlio create-run --projectConfig ${PROJECT_CONFIG_PATH} --testConfig ${TEST_CONFIG_PATH}
