#!/bin/bash
export RUN_API_TOKEN=${!RUN_API_TOKEN_ENV_NAME}
testlio create-run
