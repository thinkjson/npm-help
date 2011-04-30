// Import modules
var express = require('express');
var app = express.createServer();
var md = require("node-markdown").Markdown;
var fs = require('fs');

// Load help documents into memory
var docs = {};
fs.readdir("./npm/doc", function(err, files) {
	if (err) {
		console.log("Could not read in docs. Try to update submodules.");
		console.log(err);
	}
	
	for (var file in files) {
		fs.readFile("./npm/doc/" + files[file], function(err, data) {
			if (err) {
				console.log("Could not add file to search index:")
				console.log(err);
			} else {
				docs[files[file]] = data.toString();
			}
		});
	}
});

// Search documentation
var search_docs = function(request, response) {
	console.log(Object.keys(docs));
	var search = request.query.search;
	var results = [];
	if (search) {
		for (var doc in docs) {
			var found = docs[doc].indexOf(search);
			if (found != -1) {
				
				// Grab the result in context
				var start_context = found - 20;
				if (start_context < 0) {
					start_context = 0;
				}
				
				// Append result to results
				results.push({
					file: doc,
					context: docs[doc].substr(start_context, 40)
				});
			}
		}
		
		// Send results
		response.send(results);
	} else {
		response.send({ error: "Search invalid" }, 400);
	}
};

// Show documentation
var show_docs = function(request, response) {
	
};

// Routes
app.use(express.static("./static"));
app.get("/search", search_docs);
app.get("/show", show_docs);

// Start server
try {
	app.listen(80);
	console.log("Listening on port 80");
} catch (e) {
	app.listen(8080);
	console.log("Listening on port 8080");
}