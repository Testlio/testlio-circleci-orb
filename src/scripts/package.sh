#!/bin/bash
cd ${PROJECT_DIR} || exit
zip -r ${PACKAGE_PATH} . -x "node_modules/*" "lib/script/*" ".git/*" ".circleci/*"
