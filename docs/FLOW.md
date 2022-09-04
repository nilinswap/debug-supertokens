# FLOW

## auth apis that frontend calls

- /auth/api/session/refresh - preflight and post

  - this api is only called after some interval and on hitting the page. not sure what the interval exactly is.

  - Preflight request is basically and OPTIONS call. with a header `Access-Control-Request-Method: POST`
  - response has following headers which is pretty much the point of pre-flight.

```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: content-type,rid,fdi-version,anti-csrf
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Control-Allow-Origin: http://localhost:1234
```

    - post call first will fail and return a 401. no set-cookie in response. but somehow sIRTFrontend gets set.
    - if you are logged in, looks good so a post call is made next. empty request body, empty response body but with set-cookie with various sFrontToken, sIdRefreshToken and sAccessToken
    - what is the deal sIRTFrontend cookie? - I don't see any response setting it and it is set after the first hit. not sure what to do with it.

- auth/api/signinup/code

  - this runs when I enter my email id for otp
  - again preflight and post, I guess it is natural for no domain.
  - send my email id in payload so somewhere an email is triggered at the back.

- auth/api/signinup/code/consume

  - this runs when I entered the otp
  - payload

```json
{
  "deviceId": "LaERwkZ7DxoQmD1lVCRmx1Wva6EHkOLyMIzgoYdpV1w=",
  "preAuthSessionId": "TvXkRG_UeSO6Mt8fSVTl-GxC7o_pAB0driJWtuPVtyI=",
  "userInputCode": "860464"
}
```

    - response has set-cookie headers for sFrontToken, sIdRefreshToken and sAccessToken
    - it also has user info.

```json
{
  "status": "OK",
  "createdNewUser": false,
  "user": {
    "email": "nilinswap@gmail.com",
    "id": "f7004ce2-63d6-4d63-b395-bf6d13e9e358",
    "timeJoined": 1661678041972
  }
}
```



There are mostly two flows to test in supertokens-node

- refresh token logic - well explained [here](https://supertokens.com/docs/nodejs/usage-without-express/refresh-session#:~:text=In%20this%20API%2C%20you%20call,point%20when%20they%20were%20generated.)

- auth logic - send otp, verify otp
    - send otp to the email address. - otp generation and email sending part. how is error handled?
    - redirect to next page (frontend part)
    - accept otp and verify - otp verification through what table? where is user saved? jwt or session?
    - take back to the protected page (frontend part)



## Refresh-token logic
- where does /refresh api gets hit in frontend?
- sRefreshToken is the refresh token
- rid is how it differs recipe and so which methods to call. 
- if it is an okay but stale otp response, frontend is handling it somehow. how?

## to look out for in core
- /recipe/session/refresh

## Code style
- notice that it defines its interface in types.ts files. i.e. in one place. 
- all the functions which make request to core for session are placed under sessionFunctions. It is not a class. 
- notice how error is created and handled appropriately at the layer where it should be handled. e.g. see refreshSession 
- redirect to next page on form submit is only done after successful return of api response so that user can be asked for more input if required. 
- Notice this typing 
```
Promise<
        | {
              status: "OK";
              createdNewUser: boolean;
              user: User;
          }
        | {
              status: "INCORRECT_USER_INPUT_CODE_ERROR" | "EXPIRED_USER_INPUT_CODE_ERROR";
              failedCodeInputAttemptCount: number;
              maximumCodeInputAttempts: number;
          }
        | { status: "RESTART_FLOW_ERROR" }
    >;
```
how based on status, types are differing. ts allows that, wow.
