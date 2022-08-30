
import SuperTokens from "./lib/ts";
import Passwordless from "./lib/ts/recipe/passwordless"
import Session from "./lib/ts/recipe/session"

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
})