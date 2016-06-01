var async = require('async');
var gcloud = require('gcloud');
var datastore = process.env.LOCAL ?
	gcloud.datastore({projectId: process.env.DATASTORE_PROJECT_ID}) :
	gcloud.datastore();

module.exports = (function() {

	var queries = [];

	function add(query, callback) {
		var newLength = queries.push(query);
		return callback(null, newLength);
	}

	function empty(callback) {
		if(queries.length === 0)
			return callback(new Error('The stack is already empty'), null);
		else {
			callback(null, queries);
			queries = [];
		}
	}

	function get(callback) {
		return queries.length > 0 ? callback(null, queries) : callback(new Error('The stack is empty.'), null);
	}

	function remove(callback) {
		return queries.length > 0 ? 
			callback(null, queries.shift()) :
			callback(new Error('There are no queries to remove from the stack.'), null);
	}

	function run(callback) {
		var queryResults = [];
		async.each(queries, function(query, callback) {
			datastore.runQuery(query, function(err, res) {
				if(err) callback(err);
				else {
					queryResults.push(res);
					callback();
				}
			});
		}, function(err) {
			if(err) callback(err, null);
			else callback(null, queryResults);
		});
	}

	return {
		add: add,
		empty: empty,
		get: get,
		remove: remove,
		run: run
	};

})();
