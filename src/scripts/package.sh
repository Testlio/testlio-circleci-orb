#!/bin/bash
zip -r ${PACKAGE_NAME} ${PROJECT_DIR} -x "node_modules/*" "lib/script/*" ".git/*" ".circleci/*"
