# dcore-workshop
dcore 🇰🇷workshop


# example-app
## Run it like
### Start docker
This command will start `dcore node` and `cliwallet` in virtual enviroment

First time when running `dcore node` it will start to synchronise the blockchain data (this can take up some resources and slow down your computer a little). This will take up to an hour to fully sync.
```
docker-compose up -d
```
hint: if you want to see logs omit the -d flag `docker-compose up`

### Start server
```
npm start
```


### Interaction with docker containers
Get the logs (-f flag means that it will stay listening for new logs)
```
// For dcore node
docker logs example-app-dcore-publictestnet -f
// For cliwallet
docker logs example-app-dcore-cliwallet -f
```

Get into the container (to interact with docker daemon for example)
```
// For dcore node
docker exec -it example-app-dcore-publictestnet bash
// For cliwallet
docker exec -it example-app-dcore-cliwallet bash
```

### Dcore
Connect to the wallet through websockets