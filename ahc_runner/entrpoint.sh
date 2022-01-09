#!/usr/bin/env bash

set -e

GIT_UPSTREAM_URL=${GIT_UPSTREAM_URL:=git@github.com:oznakn/test.git}
GIT_COMMIT=${GIT_COMMIT:=d076c0520e457626d9edcbb99bb76e622a5400b3}
GIT_BRANCH=${GIT_BRANCH:=ci}

init() {
    rm -rf tmp
    mkdir tmp
    cd tmp
}

debug() {
    echo "[DEBUG] $1"
}

start_debug() {
    echo -ne "\e[34m"
}

stop_debug() {
    echo -ne "\e[0m"
}

git_clone() {
    debug "Cloning the repository $GIT_UPSTREAM_URL commit $GIT_COMMIT"

    git init .
    git remote add origin $GIT_UPSTREAM_URL
    git config --local gc.auto 0
    git -c protocol.version=2 fetch --no-tags --prune --progress \
        --no-recurse-submodules --depth=1 origin +$GIT_COMMIT:refs/ci
    git checkout --progress --force -B ci refs/ci

    debug "Clone finished."
}

install_requirements() {
    if [ -f "requirements.txt" ]; then
        debug "Installing requirements.txt"
        pip install -r requirements.txt
    fi
}

run_app() {
    python3 main.py
}

start_debug
init
git_clone
install_requirements
stop_debug

run_app
