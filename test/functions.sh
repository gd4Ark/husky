#!/bin/bash

# Exit on error
set -eu

setup() {
    name="$(basename $0)"
    testDir="/tmp/husky-test-$name"
    echo
    echo "-------------------"
    echo "+ $name"
    echo "-------------------"
    echo

    # Create test directory
    rm -rf "$testDir"
    mkdir -p "$testDir"
    cd "$testDir"

    # Init hg
    hg init
    echo '[ui]\nusername = test<test@test.com>' >.hg/hgrc

    # Init package.json
    npm_config_loglevel="error"
    npm init -y 1>/dev/null
}

install() {
    npm install ../husky.tgz
}

assert() {
    if [ $2 != $1 ]; then
        error "assert expect $2 (got $1)"
    fi
}

expect() {
    set +e
    sh -c "$2"
    exitCode="$?"
    echo "exitCode: $exitCode"
    set -e
    if [ $exitCode != "$1" ]; then
        error "expect command \"$2\" to exit with code $1 (got $exitCode)"
    fi
}

error() {
    echo -e "\e[0;31mERROR:\e[m $1"
    exit 1
}

ok() {
    echo -e "\e[0;32mOK\e[m"
}
