# Shelbot - Gambling driven charity

Purposes of Shelbot is to provide easy way how to gamble with unnecessary money on ton blockchain through telegram bot.
 
## How it Works

1) Go to: @BlockyChainyRoBotBot
2) type `/begin`
3) Choose `/register` to register in the game. (Registration cost 1 TON)
4) Wait for game to start
5) Win rock / paper / scissors / lizard / spack (and do it until you are last men standing)
6) Receive 90% of all the acquired TONs during registration
7) Rest 10% are sent to charity which will hopefully save the world 

## Development

Shelbot was build during Hack-a-Ton event in Prague. 

Contracts are written in FunC and tested with typescript

as a based template we have used: https://github.com/ton-defi-org/tonstarter-contracts

## Scripts

`npm run deploy` -- deploy to mainnet 

`npm run test` -- run testsuite for donton contracts

`npm run build` -- deploy to build 

`npm run deploy:testnet` -- deploy to testnet

`npm run deploy:sandbox` -- deploy to sandbox

