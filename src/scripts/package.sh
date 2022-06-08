#!/bin/bash
zip -r ${PACKAGE_PATH} ${PROJECT_DIR} -x "node_modules/*" "lib/script/*" ".git/*" ".circleci/*"
