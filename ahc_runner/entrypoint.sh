#!/usr/bin/env bash

set -e

GIT_UPSTREAM_URL=${GIT_UPSTREAM_URL:=git@github.com:oznakn/test.git}
GIT_COMMIT=${GIT_COMMIT:=eb58470cd48359d01ad9e159bb165eadb6fdfe4e}
GIT_BRANCH=${GIT_BRANCH:=ci}
REPO_PATH=repo
AHC_YAML_PATH=$REPO_PATH/.ahc.yml

debug() {
    echo "[DEBUG] $1"
}

error() {
    echo "[ERROR] $1"
}

start_debug() {
    echo -ne "\e[34m"
}

start_error() {
    echo -ne "\e[31m"
}

stop_debug() {
    echo -ne "\e[0m"
}

init() {
    debug "Running init"
}

git_clone() {
    debug "Cloning the repository $GIT_UPSTREAM_URL commit $GIT_COMMIT to $REPO_PATH"

    rm -rf "$REPO_PATH"
    mkdir "$REPO_PATH"
    cd "$REPO_PATH"

    git init .
    git remote add origin $GIT_UPSTREAM_URL
    git config --local gc.auto 0
    git -c protocol.version=2 fetch --no-tags --prune --progress \
        --no-recurse-submodules --depth=1 origin +$GIT_COMMIT:refs/ci
    git checkout --progress --force -B ci refs/ci

    cd ..

    debug "Clone finished."
}

run_docker() {
    docker_img=$(yq e '.image' $AHC_YAML_PATH)

    if [[ $docker_img == '.' ]]; then
        docker_img=$($RANDOM | md5sum | head -c 20)
        debug "Docker img name: $docker_img."

        docker build -t "$docker_img" "$REPO_PATH"
    else
        debug "Docker img name: $docker_img."
    fi

    docker_env_file="docker.env"

    touch "$docker_env_file"
    env_variables=$(yq e '.env' $AHC_YAML_PATH | sed 's/: /=/g')

    debug "Docker environment variables: $env_variables"

    if [[ $env_variables != 'null' ]]; then
        echo "$env_variables" > "$docker_env_file"
    fi

    start_command=$(yq e '.command' $AHC_YAML_PATH)

    docker pull "$docker_img"

    stop_debug
    docker run --rm --env-file "$docker_env_file" "$docker_img" /bin/sh -c "$start_command"
    start_debug
}

start_debug
init
git_clone
if [ -f "$AHC_YAML_PATH" ]; then
    run_docker
else
    start_error
    error "Could not find .ahc.yml file, exiting..."
    start_debug
fi

stop_debug
