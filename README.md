# Debug-ST

Debug [supertokens](https://github.com/supertokens) now!!
only supports supertokens-auth-react and supertokens-node for now.

## Setup

### Frontend

- `yarn install`

- `yarn build`

- `npx parcel index.html`

## Backend

- `python3 -m venv .venv && source .venv/bin/activate`

- `cd backend && flask --app main run -p 4321`

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

