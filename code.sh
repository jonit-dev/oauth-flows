#!/bin/bash

APP_ID='YOURAPPID'
APP_SECRET='YOURAPPSECRET'
#URI='https://joao.operatoroverload.com/oauth/google'

URI='YOURREDIRECTURL'

echo "content-type: application/json"
echo ""

# QUERY_STRING contains the auth code
CODE=$QUERY_STRING

# get token from OAuth provider
curl -data "https://www.googleapis.com/oauth2/v4/token?client_id=${APP_ID}&redirect_uri=${URI}&client_secret=${APP_SECRET}&code=${CODE}&grant_type=authorization_code"











