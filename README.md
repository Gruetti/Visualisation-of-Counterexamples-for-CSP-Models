# Visualisation-of-Counterexamples-for-CSP-Models

Author: Nils Grüttner

Running the index.html file will start this tool.
To load a counterexample, click the "Load Counterexample" button and select a file. The file must contain
a valid counterexample in JSON format, according to the provided JSONschema.json file in the "Examples" directory.
If you use a server, that provides counterexamples, make sure to set the standalone_flag in main.js to "false" and set "url" according to the server (default localhost:8000).
The server has to provide a string in JSON format, using WebSocket, according to the JSONschema.

Adding functions:
To add new functions, you can modify the contextmenu. To add a function, modify the "defaults" object, found
in the viewer.js module.


For testing purposes, there is a python server. To start the server, run "python SimpleExampleServer.py --counterexample true".
The server will send a predefined counterexample to a connecting client on OPEN. Counterexamples are given as a serialized JSON object, using
the json.dumps function. This function returns a JSON formatted string.