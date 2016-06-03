/**
 *
 */

var async = require('async');
var gcloud = require('gcloud');
var datastore = gcloud.datastore();
var Query = require('./node_modules/gcloud/lib/datastore/query');

module.exports = function() {

	var queryStack = [];

	function addAll(queries, callback) {
		if(Array.isArray(queries)) {
			var validQueries = [];
			queries.forEach(function(query) {
				if(query.constructor.toString() === Query.toString()) 
					validQueries.push(query);
			});
			if(validQueries.length === queries.length) {
				queryStack  = queryStack.concat(validQueries);
				return callback(null, queryStack.length);
			} else 
				return callback(new Error('Array does not contain only Query objects'), null);
		} else
			return callback(new Error('Input must be an array of Query objects.'), null);
	}

	/**
	 * 
	 * @param {}
	 * @param {}
	 */
	function addOne(queries, callback) {
		if(queries.constructor.toString() === Query.toString()) {
			var newLength = queryStack.push(queries);
			return callback(null, newLength);
		} else
			return callback(new Error('Input must be a Query object.'), null);
	}

	function getAll(callback) {
		return queryStack.length > 0 ? callback(null, queryStack) : callback(new Error('The stack is empty.'), null);
	}

	function getNext(callback) {
		return queryStack.length > 0 ? callback(null, queryStack[0]) : callback(new Error('The stack is empty.'), null);
	}

	function getStackLength(callback) {
		return queryStack.length;
	}

	function removeAll(callback) {
		if(queryStack.length === 0)
			return callback(new Error('The stack is already empty'), null);
		else {
			callback(null, queryStack);
			queryStack = [];
			return;
		}
	}

	function removeNext(callback) {
		return queryStack.length > 0 ? 
			callback(null, queryStack.shift()) :
			callback(new Error('There are no queryStack to remove from the stack.'), null);
	}

	function runAll(callback) {
		var queryResults = [];
		async.each(queryStack, function(query, callback) {
			datastore.runQuery(query, function(err, res) {
				if(err) return callback(err);
				else {
					queryResults.push(res);
					return callback();
				}
			});
		}, function(err) {
			if(err) return callback(err, null);
			else return callback(null, queryResults);
		});
	}

	return {
		addAll: addAll,
		addOne: addOne,
		getAll: getAll,
		getNext: getNext,
		getStackLength: getStackLength,
		removeAll: removeAll,
		removeNext: removeNext,
		runAll: runAll
	};

}();
