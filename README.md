# AESPA'CE WEB Backend

## init

```
npm i
```

## run

```
tsc
node lib/API/app.js
```

## vscode launch.json example

just the default launch.json for ts node apps

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/src/API/app.ts",
            "preLaunchTask": "tsc: build - tsconfig.json",
            "outFiles": [
                "${workspaceFolder}/lib/**/*.js"
            ]
        }
    ]
}
```
