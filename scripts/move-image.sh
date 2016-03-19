#!/bin/bash

curl --include --request PATCH http://localhost:3000/images/56e8281e37a429cda0f3b774 \
  --header "Authorization: Token token=WQAu2pC6/bm/EBLvBY/p8Q==" \
  --header "Content-Type: application/json" \
  --data '{
      "folder": "not main"
  }'
