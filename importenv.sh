#!/bin/bash
set -e
IFS='|'

AWSCLOUDFORMATIONCONFIG="{\
\"Region\": \"us-east-1\",\
\"DeploymentBucketName\": \"amplify-amplifya7ae579498c44-staging-183910-deployment\",\
\"UnauthRoleName\": \"arn:aws:iam::299795705192:role/amplify-amplifya7ae579498c44-staging-183910-unauthRole\",\
\"StackName\": \"amplify-amplifya7ae579498c44-staging-183910\",\
\"StackId\": \"arn:aws:cloudformation:us-east-1:299795705192:stack/amplify-amplifya7ae579498c44-staging-183910/c4d9fc70-ee40-11eb-92ae-0e2aa313290f\",\
\"AuthRoleName\": \"amplify-amplifya7ae579498c44-staging-183910-authRole\",\
\"UnauthRoleArn\": \"arn:aws:iam::299795705192:role/amplify-amplifya7ae579498c44-staging-183910-unauthRole\",\
\"AuthRoleArn\": \"arn:aws:iam::299795705192:role/amplify-amplifya7ae579498c44-staging-183910-authRole\"\
}"
PROVIDER_CONFIG="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"


AWS_CONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"default\"\
}"

amplify env import \
--name staging \
--config $PROVIDER_CONFIG \
--awsInfo $AWS_CONFIG \
--yes