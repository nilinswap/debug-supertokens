import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";
import Inner from "./components/inner";

import { createRoot } from "react-dom/client";

import SuperTokens, {
  SuperTokensWrapper,
  getSuperTokensRoutesForReactRouterDom,
} from "./lib/ts";
import Passwordless from "./lib/ts/recipe/passwordless";
import Session, { SessionAuth } from "./lib/ts/recipe/session";

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

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <SuperTokensWrapper>
    <BrowserRouter>
      <h1 style={{ width: "100%", textAlign: "center" }}>Debug ST (rn!)</h1>
      <Routes>
        {/* This renders the login UI on the /auth route*/}
        {/* READCODE BURI ER3: we components for every path */}
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        {/*Your app routes */}
        <Route
          path="inner"
          element={
            <SessionAuth>
              <Inner />
            </SessionAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </SuperTokensWrapper>
);
