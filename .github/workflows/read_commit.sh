#!/bin/bash

MESSAGE=$(git log -1 HEAD --pretty=format:%s)



 
  

SUBSTRING="${MESSAGE:0:3}"  




if [[ "$SUBSTRING" == fix ]]; then
         npm version patch
if [[ "$SUBSTRING" == fea ]]; then
         npm version minor
