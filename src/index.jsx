import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";

import SuperTokens, {
  SuperTokensWrapper,
  getSuperTokensRoutesForReactRouterDom,
} from "./lib/ts";
import Passwordless from "./lib/ts/recipe/passwordless";
import Session from "./lib/ts/recipe/session";

SuperTokens.init({
  appInfo: {
    appName: "utr",
    apiDomain: "http://localhost:3000",
    websiteDomain: "http://utr.corp.linkedin.com",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    Passwordless.init({
      contactMethod: "EMAIL_OR_PHONE",
    }),
    Session.init(),
  ],
});

ReactDOM.render(
  <React.StrictMode>
    <SuperTokensWrapper>
      <BrowserRouter>
        <h1>Hello World</h1>
        <Routes>
          {/* This renders the login UI on the /auth route*/}
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
          {/*Your app routes */}
        </Routes>
      </BrowserRouter>
    </SuperTokensWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);
