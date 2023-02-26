
A crazy development!! or rather revelation

0.29.0 which was using emotion (in tsconfig.json for example) compiled fine and ran well for debugger but could not be run as a library (even from supertokens upstream.) It was not letting me inside even after right otp. It worked in 0.31.1 which is latest (as of today.) (Recap - I would have used that only for debugger but 
problem is it is using rollup and not babel. I did not want to spend time configuring debugger for rollup as to debug the lib one has to use it as source-code)
Now, All I could do is use 0.31.1 (which is 33 commits ahead) for publish and 0.29.0 for debug. I compared the diff and there were total 685 changes but most of them are not to worry about. I am summarising important changes below

- override changes (e.g. ComponentOverrideContext, useComponentOverrides) 
    - lib/ts/recipe/emailpassword/components/features/resetPasswordUsingToken/index.tsx some changes
    - lib/ts/recipe/emailpassword/components/features/signInAndUp/index.tsx 
    -lib/ts/recipe/emailpassword/recipe.tsx ->  getFeatureComponent's added argument useComponentOverrides
- remove styleProvider
    - lib/ts/recipe/emailpassword/components/themes/resetPasswordUsingToken/index.tsx
    - lib/ts/recipe/emailpassword/components/themes/signInAndUp/index.tsx 
- remove {[styles.sadf]}
    - lib/ts/recipe/emailpassword/components/themes/signInAndUp/signInFooter.tsx
    - lib/ts/recipe/emailpassword/components/library/formRow.tsx
- major changes
    - remove emotion - lib/tsconfig.json
    - lib/ts/utils.ts - big change around cookies
    - package.json - rollup

- changelog captures some (listed below)


Notice that major core changes have not happened therefore it is okay to debug in 0.29.0 and make changes in 0.31.1 and then do eyeballing. If I had time, I would fix the issue with using 0.29.0 as lib (it was not showing an error too) but not today.




====================================
Changelog
## [0.31.1] - 2023-02-12

### Changes

-   Add ordering for imports
-   Force consistent type imports

### Fixes

-   Fixed all buttons to have pointer cursor on hover.
-   Fixed component override propagation into sub-recipe only feature components (i.e., ThirdPartySignInAndUpCallbackTheme_Override in thirdpartyemailpassword)

## [0.31.0] - 2023-02-01

## Breaking changes

-   Updated `supertokens-web-js` dependency that requires a backend SDK update to:
    -   supertokens-node: >= 13.0.0
    -   supertokens-python: >= 0.12.0
    -   supertokens-golang: >= 0.10.0
-   Renamed configuration options:
    -   `sessionScope` renamed to `sessionTokenFrontendDomain`
    -   `cookieDomain` renamed to `sessionTokenBackendDomain`

### Added

-   Added support for authorizing requests using the `Authorization` header instead of cookies
    -   Added `tokenTransferMethod` config option
    -   Check out https://supertokens.com/docs/thirdpartyemailpassword/common-customizations/sessions/token-transfer-method for more information

## [0.30.2] - 2023-01-21

### Changes

-   Prefilling the phone number input with the dial code if default country is set.

## [0.30.1] - 2023-01-20

### Bugfixes

-   Fixed guessing internation phone number in passwordless with EMAIL_OR_PHONE contact method if the number starts with a valid country dial code

## [0.30.0] - 2023-01-20

### Changes

-   Updated many dependencies to fix warnings during install
-   Updated our build process to use rollup as a bundler

### Breaking changes

-   Removed dependency on emotion/chroma
-   Updated to styling through plain CSS instead of objects/emotion. Check https://supertokens.com/docs/thirdpartyemailpassword/common-customizations/styling/changing-style for more info
-   Removed palette option, colors are now customizable through setting CSS variables in styles. Check https://supertokens.com/docs/thirdpartyemailpassword/common-customizations/styling/changing-colours for more info
-   Moved `supertokens-web-js` into `devDependencies`. If using npm version 6, you also need to install it with `npm i --save supertokens-web-js`. Later versions install it automatically.
-   The default phone number input changed in passwordless and thirdpartypasswordless recipe (switched to using `intl-tel-input`)

### Migration

#### Custom styles

Before:

```tsx
SuperTokens.init({
    appInfo: {
        apiDomain: "...",
        appName: "...",
        websiteDomain: "...",
    },
    recipeList: [
        ThirdPartyEmailPassword.init({
            style: {
                container: {
                    fontFamily: "cursive",
                },
            },
        }),
        Session.init(),
    ],
});
```

After:

```tsx
SuperTokens.init({
    appInfo: {
        apiDomain: "...",
        appName: "...",
        websiteDomain: "...",
    },
    recipeList: [
        ThirdPartyEmailPassword.init({
            style: `
                [data-supertokens~=container] {
                    font-family: cursive;
                }
            `,
        }),
        Session.init(),
    ],
});
```

#### Custom palette

Before:

```tsx
SuperTokens.init({
    appInfo: {
        apiDomain: "...",
        appName: "...",
        websiteDomain: "...",
    },
    recipeList: [
        ThirdPartyEmailPassword.init({
            palette: {
                background: "#333",
                inputBackground: "#292929",
                textTitle: "white",
                textLabel: "white",
                textPrimary: "white",
                error: "#ad2e2e",
                textInput: "#a9a9a9",
                textLink: "#a9a9a9",
            },
        }),
        Session.init(),
    ],
});
```

After:

```tsx
SuperTokens.init({
    appInfo: {
        apiDomain: "...",
        appName: "...",
        websiteDomain: "...",
    },
    recipeList: [
        ThirdPartyEmailPassword.init({
            style: `
                [data-supertokens~=container] {
                    --palette-background: 51, 51, 51;
                    --palette-inputBackground: 41, 41, 41;
                    --palette-inputBorder: 41, 41, 41;
                    --palette-textTitle: 255, 255, 255;
                    --palette-textLabel: 255, 255, 255;
                    --palette-textPrimary: 255, 255, 255;
                    --palette-error: 173, 46, 46;
                    --palette-textInput: 169, 169, 169;
                    --palette-textLink: 169, 169, 169;
                }
            `,
        }),
        Session.init(),
    ],
});
```