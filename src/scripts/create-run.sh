#!/bin/bash
export RUN_API_TOKEN=${!RUN_API_TOKEN_ENV_NAME}
cd ${PROJECT_DIR} || exit
zip -r test_package.zip . -x "node_modules/*" "lib/script/*" ".git/*" ".circleci/*"
testlio create-run
