#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../model
yarn build
npm publish

cd ../editor
yarn build
npm publish
