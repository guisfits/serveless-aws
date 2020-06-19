# 1 criar o arquivo de politicas de seguranca
aws iam create-role\
  --role-name lambda-exemplo\
  --assume-role-policy-document file://policies.json \
  | tee logs/role.log

# 2 criar as roles
zip function.zip index.js

# 3 criar a lambda function
aws lambda create-function \
  --function-name hello-cli \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --runtime nodejs12.x \
  --role arn:aws:iam::970991414495:role/lambda-exemplo \
  | tee logs/lambda-create.log

# 4 invoke lambda
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec.log

# 5 atualizar lambda
zip function.zip index.js

aws lambda update-function-code \
  --zip-file fileb://function.zip \
  --function-name hello-cli \
  --publish \
  | tee logs/lambda.update.log 

# invoke update
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec-update.log

# remover 
aws lambda delete-function \
  --function-name hello-cli

aws iam delete-role \
  --role-name lambda-exemplo
  
