from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import passwordless, session

from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig

from supertokens_python import get_all_cors_headers
from flask import Flask, abort
from flask_cors import CORS
from supertokens_python.framework.flask import Middleware


init(
    app_info=InputAppInfo(
        app_name="debug-st",
        api_domain="http://localhost:4321",
        website_domain="http://localhost:1234",
        api_base_path="/auth/api",
        website_base_path="/auth",
    ),
    supertokens_config=SupertokensConfig(
        # try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
        connection_uri="https://try.supertokens.com",
        # api_key="IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE"
    ),
    framework="flask",
    recipe_list=[
        session.init(),  # initializes session features
        passwordless.init(
            flow_type="USER_INPUT_CODE", contact_config=ContactEmailOrPhoneConfig()
        ),
    ],
)

app = Flask(__name__)
Middleware(app)

# TODO: Add APIs

CORS(
    app=app,
    origins=["http://localhost:1234"],
    supports_credentials=True,
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)

@app.route("/")
def hello_world():
    return "Hello World!"

# This is required since if this is not there, then OPTIONS requests for
# the APIs exposed by the supertokens' Middleware will return a 404
@app.route("/", defaults={"u_path": ""})
@app.route("/<path:u_path>")
def catch_all(u_path: str):
    abort(404)
