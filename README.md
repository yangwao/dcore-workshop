# dcore-workshop
dcore 🇰🇷workshop

Requirements 
* Docker (17+) & docker-compose (1.22+)
* Insomnia or other http client
* Node.js (10+) & npm // only for those with experience with JS
* IDE (Visual Studio Code, Atom, Sublime Text, Vim … )
* Fresh mind or coffee

### Links
Telegram channel https://t.me/DCoreDevelopers \
Dcore documentation https://docs.decent.ch/ \
Dcore Use Cases https://docs.decent.ch/UseCases/ \
Github repository https://github.com/DECENTfoundation \
Public testnet explorer https://hackathon-explorer.decent.ch/ 

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
Install dependencies before starting the server
```
npm install
```
Start the server
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

Remove containers
```
docker rm -f example-app-dcore-cliwallet
docker rm -f example-app-dcore-publictestnet
```

Remove container data
```
rm -rf example-app/data_publictestnet # this will remove blockchain data
rm -rf example-app/data_cliwallet # this will remove wallet data
```

### Dcore
Connect to the dcore node through websockets
```
wscat -nc ws://localhost:18090
```
