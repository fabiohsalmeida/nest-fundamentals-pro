I had to create a .vscode folder
Create the launch.json file:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach",
            "port": 9229,
            "request": "attach",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        }
    ]
}
```

Then I had to run in debug mode the application ``npm run start:debug``

After it I had to put the break points and to go in the Run and Debug tab here at visualcode, in there is a attach, running that I was able to actually stop at the breakpoint.