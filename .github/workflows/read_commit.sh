#!/bin/bash

MESSAGE=$(git log -1 HEAD --pretty=format:%s)
INPUT = "fix:hello"


  

SUBSTRING=$(echo $INPUT| cut -d':' -f 1) 




if [[ "$SUBSTRING" == "fix" ]]; then
         npm version patch
if [[ "$SUBSTRING" == "feat" ]]; then
         npm version minor
