#!/bin/bash
set -e
set -o nounset
set -o errexit
set -o xtrace

cd ${PROJECT_DIR} || exit
zip -r ${PACKAGE_PATH} . -x "node_modules/*" "lib/script/*" ".git/*" ".circleci/*"
