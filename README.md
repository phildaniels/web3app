# Running this example

Run the following commands in multiple terminals. You system will need node, npx, npm, azure functions cli, a pinata account, a mongodb api cosmos db available, and metamask installed in your browser

### Terminal 1

For first run only

```
npm install
```

then

```
npm start
```

Do not use ng serve or tailwind styles will not be applied

## Terminal 2

Run this every time

```
npx hardhat node
```

add one of the accounts to your metamask instance to get some fake test ETH

## Terminal 3

run this every time you make a change to a smart contract

```
npx hardhat compile
npx hardhat run scripts/deploy.ts --network localhost

```

Terminal 3 can be closed now

Copy the network key to your metamask instance, then

### Terminal 4 (optional, if you wish to do hot reloading on the azure functions)

cd functions/
tsc -w

### Terminal 4

```
cd functions/
```

first run only

```
npm install
```

then

```
func start
```

here is an example local.settings.json to add to your project, you will need your own with the "<...>" replaced with your values

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOSDB_CONNECTIONSTRING": "<your cosmos db connection string for mongo>",
    "COSMOSDB_USER": "<your cosmos instance>",
    "COSMOSDB_PASSWORD": "<your cosmos password>",
    "COSMOSDB_DBNAME": "orders",
    "COSMOSDB_HOST": "<your cosmos instance>.mongo.cosmos.azure.com",
    "COSMOSDB_PORT": "10255",
    "EventGridEndpoint": "http://localhost:7071/runtime/webhooks/eventgrid?functionName=OrdersEventGrid" // for local, otherwise a valid event grid
		"EventGridAegSasKey": "<your key here>"
  },
  "Host": {
    "Cors": "*"
  }
}
```
