/**
 *
 */

var async = require('async');
var gcloud = require('gcloud');
var gcloudDatastore = gcloud.datastore();
var Query = require('./node_modules/gcloud/lib/datastore/query');

module.exports = (function() {

	var queryQueue = [];

	function addQueries(queries, callback) {
		if(Array.isArray(queries)) {
			var validQueries = [];
			queries.forEach(function(query) {
				if(query.constructor.toString() === Query.toString()) 
					validQueries.push(query);
				else 
					throw new Error('Expected ' + query.constructor.toString() + ' to equal: ' + Query.toString());
			});
			if(validQueries.length === queries.length) {
				queryQueue  = queryQueue.concat(validQueries);
				return queryQueue.length;
			} else 
				throw new Error('Array does not contain only Query objects');
		} else
			throw new Error('Input must be an array of Query objects.');
	}

	/**
	 * 
	 * @param {}
	 * @param {}
	 */
	function addQuery(query) {
		if(query.constructor.toString() === Query.toString()) {
			var newLength = queryQueue.push(query);
			return newLength;
		} else
			throw new Error('Expected ' + query.constructor.toString() + ' to equal: ' + Query.toString());
	}

	function createQuery(namespace, kind) {
		if(typeof namespace === 'string' && !kind) {
			kind = namespace;
			return gcloudDatastore.createQuery(kind);
		} else if(typeof namespace === 'string' && typeof kind === 'string')
			return gcloudDatastore.createQuery(namespace, kind);
		else
			throw new Error('Expected inputs to be of type [String]');
	}

	function getAllQueries() {
		if(queryQueue.length > 0)
			return queryQueue;
		else
			return null;
	}

	function getNextQuery() {
		if(queryQueue.length > 0)
			return queryQueue[0];
		else
			return null;
	}

	function getQueueLength() {
		return queryQueue.length;
	}

	function removeAllQueries() {
		if(queryQueue.length > 0) {
			var result = queryQueue;
			queryQueue = [];
			return result;
		} else
			return null;
	}

	function removeNextQuery() {
		if(queryQueue.length > 0) 
			return queryQueue.shift();
		else 
			return null;
	}

	function runAllQueries(callback) {
		var queryResults = [];
		async.each(queryQueue, function(query, callback) {
			gcloudDatastore.runQuery(query, function(err, res) {
				if(err) return callback(err);
				else {
					queryResults.push(res);
					return callback();
				}
			});
		}, function(err) {
			if(err) return callback(err, null);
			else {
				var queryQueue = [];
				return callback(null, queryResults);
			}
		});
	}

	return {
		addQueries: addQueries,
		addQuery: addQuery,
		createQuery: createQuery,
		getAllQueries: getAllQueries,
		getNextQuery: getNextQuery,
		getQueueLength: getQueueLength,
		removeAllQueries: removeAllQueries,
		removeNextQuery: removeNextQuery,
		runAllQueries: runAllQueries
	};

}());
