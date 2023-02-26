# Debug-ST

Debug [supertokens](https://github.com/supertokens) now!!
only supports supertokens-auth-react and supertokens-node for now.

## Setup

### Frontend

- `yarn install`

- `yarn build`

- `npx parcel index.html`


## Backend - NOT NEEDED

- `python3 -m venv .venv && source .venv/bin/activate`

- `cd backend && pip install -r requirements.txt && flask --app main run -p 4321`


### use node backend
- `cd be_node`

- `yarn dev`

## how to debug

### supertokens-auth-react

- do frontend steps to setup, build and run. 

- run `Launch Chrome against localhost for frontend debugging` from debugger.

### supertokens-node

- do frontend steps to setup, build and run.

- run `Launch Backend Program` from debugger.

## Play

go to http://localhost:1234/inner 

## Todo 
- match BURI and BUNI with new code. follow same debug steps to ensure that everything is fine. This time, we can't let it slip
- publish both of them as npm libraries and make an app that uses it
- focus on supertokens-core. 
    - run it locally
    - put debugger
    - understand


## things 
1. I updated them to as new as 0.29 of supertokens-auth-react and 13.0.2 (from 11.0.2 I guess) of super-tokens node. Why I chose 0.29? and not latest (0.31) because I was struggling to compile with rollup. We will go with these versions only. No more the same thing of upgrading and then re-visiting code. 




## WhatCanBe

[] publish both node and react library as your own npm package.


### LISTEN HERE
read LISTEN_HERE.md  - it talks about versions and debugging.