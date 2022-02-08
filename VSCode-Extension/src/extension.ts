// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Express} from 'express';
import { Uri } from 'vscode';
const express = require("express");
const app : Express = express();
const port = 6070;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "peeky" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('peeky.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Peeky!');
	});

	context.subscriptions.push(disposable);

	CreateHTTPListener();
}

function CreateHTTPListener() {
	app.get('/open', (req, res) => {
		const resource : string = req.query.file as string;
		const uri : Uri = Uri.file(resource);

		vscode.window.showInformationMessage(`Open file '${resource}'`);
		vscode.workspace.openTextDocument(uri).then((doc: vscode.TextDocument) => {
			vscode.window.showTextDocument(doc, 1, false);
		});

		res.sendStatus(200);
	});

	app.listen(port, () => {
		console.log(`server started at http://localhost:${port}`);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
