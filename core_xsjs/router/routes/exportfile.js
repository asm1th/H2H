/*eslint-disable */
var express = require('express');
var router = express.Router();

// import { Document, Packer, Paragraph, TextRun } from "docx";
const docx = require("docx");
const fs = require("fs");

const doc = new docx.Document();
doc.addSection({
	properties: {},
	children: [
		new docx.Paragraph({
			children: [
				new docx.TextRun("Hello World"),
				new docx.TextRun({
					text: "Foo Bar",
					bold: true,
				}),
				new docx.TextRun({
					text: "\tGithub is the best",
					bold: true,
				}),
			],
		}),
	],
});

router.get('/', function (req, res, next) {
	//res.send('respond with a resource');
	docx.Packer.toBase64String(doc).then(function (fileBase64String) {
		//res.send(fileBase64String);

		res.set('Content-Disposition', 'attachment; filename="filename.docx"');
		res.set('Content-Type', 'vnd.openxmlformats-officedocument.wordprocessingml.document');
		res.end(fileBase64String, 'base64')
	})
});

module.exports = router;