# Journey

Goal is to understand supertokens well enough so that I can customise it. 
I built a debugger setup for that. debugging is quite a fast way to understand the flow.

First, I made a simple app and saw to it that it works with the lib from node_modules. I used react at front and django at back. Then I removed the package supertokens-auth-react and installed it in src next to index.
A typical problem that happenened many times in these situations were, they having different compiling dependencies and scripts.. basically different package.json and tsconfig.json. 
I failed to realise this and failed with cryptic errors twice. 
My strategy was mostly to always extend package.json and tsconfig.json of lib to form corresponding files for app. 

Some challenges in merging package.json are

1. different module versions for common modules
2. different build scripts
3. confusing node_packages
4. making build scripts compile ts files.

### how I setup
Different versions is resolved hoping versions are backwards compatible.
There can be so many different ways to compile and one has to ensure that they don't endup in different places and the linking is messed. 


#### supertokens-auth-react

So I took this project from [react-boilerplate](https://github.com/nilinswap/react-boilerplate) and it uses parcel for building files. best thing about parcel is tsx compilation is purely out of the box. 
so it uses 
```
"start": "parcel src/index.html",
"build": "parcel build src/index.html",
```
while supertokens-auth-react being a library would only have a compile command. 
```
"build": "cd lib && rm -rf build && npx tsc -p tsconfig.json",
```

merging would mean having lib inside src, merging tsconfig.json and then compiling files to something that parcel can use. 
src/lib is same as supertokens-auth-react/lib so actually pulling the latest code is not going to be easy but still not very difficult (copy-pasta)

Naturally it is correct to use lib's tsc command but keeping in mind that there is only one tsconfig file, the merged one. so I changed it to 

```
"build": "rm -rf build && cd src && npx tsc -p ../tsconfig.json && cd .. && parcel build index.html",
```

again, merging tsconfig.json was basically extending lib's tsconfig.json to accomdate for app. Later, I had to exclude `be_node` so that ts doesn't compile those files.

`<script src="src/index.tsx"></script>`


Somewhere along, I faced `Component cannot be used as a JSX component` error (and solution to use jsx: react was an override of lib and caused `Cannot use JSX unless the '--jsx' flag is provided`) for some reason. I swear I tried a lot of things like chaning jsx flag in tsconfig etc. I changed extension to .jsx and it worked. now, while writing this doc, I changed it to tsx it worked here too. I am sad.

Also, it was a major challenge to just take lib sub-folder of supertokens-auth-react because it has a rather weird way of export structure. I challenged that by simplifying it for local module. 


#### supertokens-node

same drill, first created a simple express project and tried using the node_modules way. Next I cloned the library in lib folder. Unlike last time, I cloned the whole repo so it is quite git-pullable (actually I deleted .git fml). I bootstraped from [express_psql_boilerplate](https://github.com/nilinswap/express_psql_boilerplate) and had supertokens-node in the lib folder but I made a rookie mistake of not merging the npm projects. I realised it quite late when I started facing

```
> cd lib && rm -rf build && npx tsc -p tsconfig.json && cd ../test/with-typescript && npx tsc -p tsconfig.json --noEmit && cd ../.. && npm run post-build

ts/framework/express/framework.ts:148:18 - error TS2430: Interface 'SessionRequest' incorrectly extends interface 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
  Types of property 'session' are incompatible.
    Type 'SessionContainerInterface | undefined' is not assignable to type 'Session & Partial<SessionData>'.
      Type 'undefined' is not assignable to type 'Session & Partial<SessionData>'.
        Type 'undefined' is not assignable to type 'Session'.

148 export interface SessionRequest extends Request {
                     ~~~~~~~~~~~~~~

ts/recipe/session/framework/express.ts:24:44 - error TS2345: Argument of type 'SessionRequest' is not assignable to parameter of type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
  Types of property 'session' are incompatible.
    Type 'SessionContainerInterface | undefined' is not assignable to type 'Session & Partial<SessionData>'.
      Type 'undefined' is not assignable to type 'Session & Partial<SessionData>'.

24         const request = new ExpressRequest(req);
                                              ~~~


Found 2 errors.
```

Again this took up majority of my time in setting up. I went to supertokens.com discord channel too for help. I must be a fool for not suspecting that someway the typescript version here and typescript version of lib may be different. after all, no one leaves the github repo in this state and I did not make a code change. I took the clone in /tmp and ran the build command and it ran. also Rishabh suggested me to fix version and that is when I saw `../../../node_modules/@types/whatwg-url/index.d.ts:73:43 - error TS1005: ',' expected.`. EVEN THEN, I ignored so many `..` . Finally I realised that it is confusing node_modules. I then merged package.json and made it to work. I should look at my errors more closely, even if they don't make sense. 

I did not merge tsconfig.json though and it still worked. 

One thing that I had to change was to move add-ts-no-check.js out of library to where the build command was being run.

Now while merging package.json, I moved first four build scripts - start, compile, prestart and dev directly but setting up for debugging was not that easy. I first tried to use yarn dev but struggled finding write code in launch.json and that is when the readlog came to help. I had written a text on how to debug, I followed it. I was skeptic that it will work just like that e.g. giving entry point as a ts file instead of that of a compiled js. I took many hits and came back to what was exactly written in the readlog. I should have listened to me. One thing that I stuck is - when you add a prelaunch task in launch config, you are expected to create a task in tasks.json for it. If not already there, it is prompts and you can create it in a click of the button. That tasks.json task helps you decide the command to run and there you can run any command that you have registered in package.json. Again, I have many package.json and I was selecting lib's tsconfig instead of be_node. also `npm run compile` is misleading because it also leaves the server running. 
Finally I selected right tsc command and I added `"sourceMap": true" in all tsconfig.json. It worked somehow. 

I realised mostly default config is all that is enough to make it work. I should read errors thoroughly, no matter how ugly and I should trust the upstream more. 
I still don't understand how it is working with two tsconfig but honestly, I am tired for today. That experiment I will test again. 


[how nodejs is resolved](https://www.bennadel.com/blog/2169-where-does-node-js-and-require-look-for-modules.htm)

Probably an overall disadvantage of this whole process is a very bloated up. like this project is already 1.64 gb because of so many node_modules and .venv. this problem can be fixed by using workspaces and now that I understand the problem, I should use workspaces from next time, or in fact, modify this to use workspaces or use 'baseURL' and 'path' to pin down where node_modules path. 

Further, I should understand following concepts well.

[module resolution in js](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
[ts options](https://www.typescriptlang.org/tsconfig#moduleResolution) - mostly to realise that I should be careful touching them. 
[workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) do they share modules and if yes, how does it resolve version conflict?

