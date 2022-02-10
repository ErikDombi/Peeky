// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Express} from 'express';
import { Uri } from 'vscode';
import { Server } from 'http';
import axios from 'axios';
const express = require("express");
const app : Express = express();
const port = 6070;

let peekyStatusBarItem: vscode.StatusBarItem;
let serverInstance: Server;

const startServerCommandId = 'peeky-xray.startListener';
const stopServerCommandId = 'peeky-xray.stopListener';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("Peeky loaded!");
	createHTTPListener();

	
    context.subscriptions.push(vscode.commands.registerCommand(startServerCommandId, () => {
		axios.get(`http://localhost:${port}/close`).finally(() => {
			serverInstance = app.listen(port, () => {
				console.log(`Peeky server started at http://localhost:${port}`);
				peekyStatusBarItem.text = 'Peeky: Active';
				peekyStatusBarItem.command = stopServerCommandId;
			});
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand(stopServerCommandId, () => {
		serverInstance?.close();
		peekyStatusBarItem.text = 'Peeky: Inactive';
		peekyStatusBarItem.command = startServerCommandId;
		console.log(`Peeky server stopped`);
	}));

	peekyStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10000);
	peekyStatusBarItem.text = 'Peeky: Inactive';
	peekyStatusBarItem.command = startServerCommandId;
	peekyStatusBarItem.show();
}

function createHTTPListener() {
	app.get('/open', (req, res) => {
		const resource : string = req.query.file as string;
		const uri : Uri = Uri.file(resource);

		vscode.workspace.openTextDocument(uri).then((doc: vscode.TextDocument) => {
			vscode.window.showTextDocument(doc, 1, false);
		});

		res.sendStatus(200);
	});

	app.get('/close', (req, res) => {
		serverInstance?.close();

		peekyStatusBarItem.text = 'Peeky: Inactive';
		peekyStatusBarItem.command = startServerCommandId;
		console.log(`Peeky server stopped`);

		vscode.window.showInformationMessage("Disabling Peaky as it was enabled in another window");

		res.sendStatus(200);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
