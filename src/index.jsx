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
    appName: "debug-st",
    apiDomain: "http://localhost:4321",
    websiteDomain: "http://localhost:1234",
    apiBasePath: "/auth/api",
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
  <SuperTokensWrapper>
    <BrowserRouter>
      <h1>Hello World</h1>
      <Routes>
        {/* This renders the login UI on the /auth route*/}
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        {/*Your app routes */}
      </Routes>
    </BrowserRouter>
  </SuperTokensWrapper>,
  document.getElementById("root")
);
