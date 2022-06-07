#!/bin/bash
cd ${PROJECT_DIR}
zip -r test_package.zip . -x "node_modules/*" "lib/script/*" ".git/*" ".circleci/*"
testlio create-run
