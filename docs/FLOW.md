# FLOW
( When you read this doc, it is expected that you know nothing about this code. So if you know something, forget it.)

(go to [a video on supertokens working](https://www.youtube.com/watch?v=MA5JDmUlO3E) and understand basics)


# Level 1

## S1 Setup 
to set it up, follow these steps for [frontend](https://supertokens.com/docs/passwordless/quick-setup/frontend) and [backend](https://supertokens.com/docs/passwordless/quick-setup/backend). We did it in `src/index.tsx` for frontend and in `be_node/src/app.ts` for backend. 
(more on the project setup and structure in `docs/INDEX.md`)

To see it in action, while you run both servers - go to http://localhost:1234/inner . If you are not already logged in, you would be redirected to auth page. 

to highlight

S1.SAR2. for frontend, We inited a supertokens instance. we wrapped our main app with `SuperTokensWrapper` and extended routes `{getSuperTokensRoutesForReactRouterDom(reactRouterDom)}`  and wrap the component that wants auth with `PasswordlessAuth`.

S1.SN2. for backend, we inited a supertokens instance. we then allowed our domain for cors and we added a middleware. 

S1.SC2. There is a backend core called supertokens-core. -> unimplemented()

# Level 2

## S1.SAR2. supertokens-auth-react

What behaviour are we going to understand?

- the component which has PasswordlessAuth wrapper around it, would not be opened without auth. other routes are allowed to be opened
- /auth would lead to the signinup page. so technically, authed component redirects to /auth.
- you can enter your email-id and on click of submit button, you are awaited for the response from backend to tell it was successful to send otp. You are redirected to accept_otp page
- you enter otp and you are redirected to the page which you landed on the first time you came. so redirectTo was preserved in the whole process. Your cookies are set with sRefreshToken and sAccessToken. 
- Next time, you go to authed page, you are not asked for auth. 
- if it is an okay response but stale otp response, frontend is handling it to show wrong otp. 
- regularly /refresh the refresh token
- if you are logged out, it remembers my email id and asks me if I want to go ahead. 
- there are different themes that I can select. 

Below are components to understand for this

S1.SAR2.STN3 - singleton pattern -> use of supertokens.init to initialize config and even config values are singletoned
S1.SAR2.RTL3 - redirection to auth if wrapper wraps the component otherwise just render

## S1.SN2 supertokens-node

What behaviour are we going to understand? 

- Frontend going to call few apis served by backend sdk
- there are two cookies for auth access_token or AT (it is `sAccessToken`) and refresh_token or RT (it is `sRefreshToken`)
- all the requests go through middleware.
- Session Check Logic
  - If requests have fresh AT and RT, you are allowed into /inner.
  - If requests have fresh RT but stale AT, on hit of any request or say page reload - /session/refresh is called which sets new values for AT and RT. 
  - If both AT and RT are expired, you are logged out. 
- Auth Logic
  - When I hit /inner, I am redirected to /auth with redirectTo as /inner with signinup form. on entering email-id, /signinup/code is hit. in the back, it sends otp to email address and and after it, in the front it redirects to accept otp page. 
  - when I enter otp, it hits /signinup/consume. in the back, verifies otp and creates session and sets cookies and in the front, I am redirected to /inner 

# Level 3

## S1.SAR2.STN3

Notice we just define supertokens.init(...) but we don't seem to use it anywhere directly. We don't use it but supertokens library does.. by importing supertokens and getting its instance. This instance is the same one that we inited so how does library get that instance? - it is because supertokens is a singleton. Otherwise we will have to import it everywhere unnecessarily. even config values are created singleton. it is because in places in library, we are also using those config values directly (don't know why.)

## S1.SAR2.RTL3

See src/lib/ts/recipe/session/sessionAuth.tsx 's setInitialContextAndMaybeRedirect() - there we are calling redirectToLogin() if the session does not exist otherwise we are returning the children under auth HLC. SessionAuth is the nth-level inner component of actual  HLC that we use in index.tsx (`PasswordlessAuth`)
```
<SessionContext.Provider value={{ ...actualContext, isDefault: false }}>
  {children}
</SessionContext.Provider>
```








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




### Active Questions
1. what is the role of sIRTfrontend cookie?
2. If I go to the localhost:1234/inner after long time so I was kinda logged out, it directly took me Enter OTP page and it knew my email id. There was no network call. email, it got from data in local storage. where is the logic for this?
3. 