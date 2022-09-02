import express from "express";
import cors from "cors";
import { middleware } from "../lib/supertokens-node/lib/ts/framework/express";

import supertokens from "../lib/supertokens-node/lib/ts";
import Session from "../lib/supertokens-node/lib/ts/recipe/session";
import Passwordless from "../lib/supertokens-node/lib/ts/recipe/passwordless";

supertokens.init({
  framework: "express",
  supertokens: {
    // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI: "https://try.supertokens.com",
    // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
  },
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: "something",
    apiDomain: "http://localhost:4321",
    websiteDomain: "http://localhost:1234",
    apiBasePath: "/auth/api",
    websiteBasePath: "/auth",
  },
  recipeList: [
    Passwordless.init({
      flowType: "USER_INPUT_CODE",
      contactMethod: "EMAIL_OR_PHONE",
    }),
    Session.init(), // initializes session features
  ],
});

let app = express();

app.use(
  cors({
    origin: "http://localhost:1234",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);

// IMPORTANT: CORS should be before the below line.
app.use(middleware());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app
  .listen(4321, () => {
    console.log("Server started on port 4321");
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("listening", () => {
    console.log("Server is listening");
  })
  .on("close", () => {
    console.log("Server is closed");
  })
  .on("connection", () => {
    console.log("Server is connected");
  })
  .on("disconnect", () => {
    console.log("Server is disconnected");
  });

export default app;
