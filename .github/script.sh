#!/bin/bash

MESSAGE=$(git log -1 HEAD --pretty=format:%s)
echo $MESSAGE
INPUT="fix:hello"

SUBSTRING=$(echo $INPUT| cut -d':' -f 1) 

if [[ "$SUBSTRING" == "fix" ]]; then npm version patch; fi
if [[ "$SUBSTRING" == "feat" ]]; then npm version minor; fi
