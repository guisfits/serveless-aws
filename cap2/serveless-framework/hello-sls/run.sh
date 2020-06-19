# install 
npm i -g serverless

# criar o projeto
serverless

# deploy
serverless deploy

# invocar
sls invoke -f hello --log

# invocar local
sls invoke local -f hello --log

# logs
sls logs -f hello

# tail
sls logs -f hello --tail

