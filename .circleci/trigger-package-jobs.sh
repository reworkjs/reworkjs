#!/usr/bin/env bash

# Detects folders in /packages that have changed since the creating of this branch
# and run requested task on them
# Tasks are scoped by appending the name of the package to them.
#
# example:
#
# The following command:
# > ./trigger-package-jobs.sh build
#
# With the following changed packages:
# > api, front-end
#
# Will trigger the following builds on CircleCI:
# - build-api
# - build-front-end

TASK=$1

echo -e "Attempting to run '$TASK' on modified packages\n"

PACKAGES_DIRECTORY=packages
MONOREPO_PATH=github/ilico-be/ilico-app
CIRCLE_TOKEN=9f6b222ebf2c6575f41cabaa5d29c65fe52a74ae

CURRENT_BRANCH="${CIRCLE_BRANCH:-`git branch | grep \* | cut -d ' ' -f2`}"

echo -e "Current Branch: ${CURRENT_BRANCH}\n"

# check if CI config changed, and if so run all the tests.
if [[ "$(git diff origin/master --name-only -- .circleci)" ]];
then
  modified_packages=($(ls ${PACKAGES_DIRECTORY}))
  echo -e "CI configuration changed. Marking all packages as to be tested.";
else
  # check which changes have not been merged in master yet and run tests in those folders
  git --no-pager diff --no-commit-id --name-only origin/master -- ${PACKAGES_DIRECTORY} | cut -d/ -f2 | sort -u > modified-packages
  modified_packages=(`cat modified-packages`)
  rm modified-packages
fi;

echo -e "Modified packages:"
for pkg in "${modified_packages[@]}"; do
  echo -e "$pkg"
done

for project in ${modified_packages[@]}; do

  scopedTask="$TASK-$project"

  # check if the job exists before triggering itgit
  taskConfig=(`yaml get .circleci/config.yml jobs.${scopedTask}`)

  if [[ "${taskConfig}" = "" ]]; then
    echo "Scoped task $scopedTask does not exist. Skipped"
  else
    echo -e "Running task $scopedTask\n"

    # run rask
    curl -s -u ${CIRCLE_TOKEN}: \
      -d build_parameters[CIRCLE_JOB]=${scopedTask} \
      https://circleci.com/api/v1.1/project/${MONOREPO_PATH}/tree/${CURRENT_BRANCH}

    echo -e "\n\n"
  fi
done
