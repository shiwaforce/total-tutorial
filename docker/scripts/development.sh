#!/bin/bash

echo "Total Tutorial is building..."
echo "Actual user is '$(whoami)' $(id -u)"
echo "Node version is '$(node -v)'"
echo "NPM version is '$(npm -v)'"
echo "Current dir is $(pwd)"

cd ../../frontend
cat developer-tools/logo.txt
../docker/scripts/npmi

_term() {
	echo "Caught SIGTERM signal!"
	kill -TERM "$child"
}
trap _term SIGTERM

npm run dev &
child=$!
wait "$child"
