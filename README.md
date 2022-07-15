# Running this example

Run the following commands in multiple terminals. You system will need node, npx, npm, azure functions cli, and metamask installed in your browser

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
