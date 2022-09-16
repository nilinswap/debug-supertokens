/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*
 * Imports.
 */
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  PropsWithChildren,
  useCallback,
} from "react";
import SessionContext, { isDefaultContext } from "./sessionContext";
import Session from "./recipe";
import { RecipeEventWithSessionContext, SessionContextType } from "./types";
import { useUserContext } from "../../usercontext";
import UserContextWrapper from "../../usercontext/userContextWrapper";
import { useOnMountAPICall } from "../../utils";

type PropsWithoutAuth = {
  requireAuth?: false;
};

type PropsWithAuth = {
  requireAuth: true;
  redirectToLogin: () => void;
};

export type SessionAuthProps = (PropsWithoutAuth | PropsWithAuth) & {
  onSessionExpired?: () => void;
};

const SessionAuth: React.FC<PropsWithChildren<SessionAuthProps>> = ({
  children,
  ...props
}) => {
  if (props.requireAuth === true && props.redirectToLogin === undefined) {
    throw new Error(
      "You have to provide redirectToLogin or onSessionExpired function when requireAuth is true"
    );
  }
  const requireAuth = useRef(props.requireAuth);

  if (props.requireAuth !== requireAuth.current) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/quotes
      'requireAuth prop should not change. If you are seeing this, it probably means that you are using SessionAuth in multiple routes with different values for requireAuth. To solve this, try adding the "key" prop to all uses of SessionAuth like <SessionAuth key="someUniqueKeyPerRoute" requireAuth={...}>'
    );
  }

  const parentSessionContext = useContext(SessionContext);

  // assign the parent context here itself so that there is no flicker in the UI
  const [context, setContext] = useState<SessionContextType>(
    !isDefaultContext(parentSessionContext)
      ? parentSessionContext
      : { loading: true }
  );

  const session = useRef<Session>();
  const userContext = useUserContext();

  const buildContext = useCallback(async (): Promise<SessionContextType> => {
    if (session.current === undefined) {
      session.current = Session.getInstanceOrThrow();
    }

    if (!context.loading) {
      return context;
    }

    const sessionExists = await session.current.doesSessionExist({
      userContext,
    }); // READCODE BURI RTL3: Somehow finds out if the session exists or not.

    if (sessionExists === false) {
      // READCODE BURI: If the session does not exist, return empty payload
      return {
        doesSessionExist: false,
        accessTokenPayload: {},
        userId: "",
        loading: false,
      };
    }

    // READCODE BURI RTL3 SES3: If the session exists, get the access token payload securely by calling api.
    return {
      doesSessionExist: true,
      accessTokenPayload: await session.current.getAccessTokenPayloadSecurely({
        userContext,
      }),
      userId: await session.current.getUserId({
        userContext,
      }),
      loading: false,
    };
  }, []);

  const setInitialContextAndMaybeRedirect = useCallback(
    // READCODE BURI RTL3: this method is called after user data from api is recieved.
    async (toSetContext: SessionContextType) => {
      if (toSetContext.loading === true) {
        // We should not be updating the context to loading
        throw new Error("Should never come here");
      }

      if (!toSetContext.doesSessionExist && props.requireAuth === true) {
        // READCODE BURI RTL3: redirect to login
        props.redirectToLogin();
      } else {
        setContext((context) => (!context.loading ? context : toSetContext));
      }
    },
    [props.requireAuth, props.requireAuth === true && props.redirectToLogin]
  );

  useOnMountAPICall(buildContext, setInitialContextAndMaybeRedirect);

  // subscribe to events on mount
  useEffect(() => {
    function onHandleEvent(event: RecipeEventWithSessionContext) {
      switch (event.action) {
        case "SESSION_CREATED":
          setContext(event.sessionContext);
          return;
        case "REFRESH_SESSION":
          setContext(event.sessionContext);
          return;
        case "ACCESS_TOKEN_PAYLOAD_UPDATED":
          setContext(event.sessionContext);
          return;
        case "SIGN_OUT":
          setContext(event.sessionContext);
          return;
        case "UNAUTHORISED":
          setContext(event.sessionContext);
          if (props.onSessionExpired !== undefined) {
            props.onSessionExpired();
          } else if (props.requireAuth === true) {
            props.redirectToLogin();
          }
          return;
      }
    }

    if (session.current === undefined) {
      session.current = Session.getInstanceOrThrow();
    }

    // we return here cause addEventListener returns a function that removes
    // the listener, and this function will be called by useEffect when
    // onHandleEvent changes or if the component is unmounting.
    // READCODE BURI: this events are raised by fetch.js in supertokens-website's lib/ts/fetch.ts and it is caught here, context is set (if settable otherwise redirect appropriately) and on redirection happens. 
    return session.current!.addEventListener(onHandleEvent);
  }, [props]);

  const actualContext = !isDefaultContext(parentSessionContext)
    ? parentSessionContext
    : context;
  if (
    props.requireAuth === true &&
    (actualContext.loading || !actualContext.doesSessionExist)
  ) {
    // READCODE BURI RTL3: This is where we decide to not show the thing inside the HLC as the guy is not logged in. this is only relevant if requireAuth is true.. we return null so that nothing is shown in that place but we have set an event to be handled when api response returns, that is where we are redirecting.
    return null;
  }

    return (
      // READCODE BURI RTL3 SES3: This is where we decide to show the children of HLC; we also pass user data

      <SessionContext.Provider value={{ ...actualContext, isDefault: false }}>
        {children}
      </SessionContext.Provider>
    );
};

const SessionAuthWrapper: React.FC<
  PropsWithChildren<
    SessionAuthProps & {
      userContext?: any;
    }
  >
> = (props) => {
  return (
    <UserContextWrapper userContext={props.userContext}>
      <SessionAuth {...props} />
    </UserContextWrapper>
  );
};

export default SessionAuthWrapper;
