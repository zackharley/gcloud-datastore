/**
 *
 */

var async = require('async');
var gcloud = require('gcloud');
var datastore = gcloud.datastore();
var Query = require('./node_modules/gcloud/lib/datastore/query');

module.exports = (function() {

	var queryQueue = [];

	function addAll(queries, callback) {
		if(Array.isArray(queries)) {
			var validQueries = [];
			queries.forEach(function(query) {
				if(query.constructor.toString() === Query.toString()) 
					validQueries.push(query);
			});
			if(validQueries.length === queries.length) {
				queryQueue  = queryQueue.concat(validQueries);
				return callback(null, queryQueue.length);
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
			var newLength = queryQueue.push(queries);
			return callback(null, newLength);
		} else
			return callback(new Error('Input must be a Query object.'), null);
	}

	function getAll(callback) {
		return queryQueue.length > 0 ? callback(null, queryQueue) : callback(new Error('The queue is empty.'), null);
	}

	function getNext(callback) {
		return queryQueue.length > 0 ? callback(null, queryQueue[0]) : callback(new Error('The queue is empty.'), null);
	}

	function getQueueLength(callback) {
		return queryQueue.length;
	}

	function removeAll(callback) {
		if(queryQueue.length === 0)
			return callback(new Error('The queue is already empty'), null);
		else {
			var result = queryQueue;
			queryQueue = [];
			return callback(null, result);
		}
	}

	function removeNext(callback) {
		return queryQueue.length > 0 ? 
			callback(null, queryQueue.shift()) :
			callback(new Error('There are no queryQueue to remove from the queue.'), null);
	}

	function runAll(callback) {
		var queryResults = [];
		async.each(queryQueue, function(query, callback) {
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
		getQueueLength: getQueueLength,
		removeAll: removeAll,
		removeNext: removeNext,
		runAll: runAll
	};

}());
