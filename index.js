/**
 *
 */

var async = require('async');
var gcloud = require('gcloud');
var gcloudDatastore = gcloud.datastore();
var Query = require('./node_modules/gcloud/lib/datastore/query');

module.exports = (function() {

	var queryStack = [];

	function addQueries(queries, callback) {
		if(Array.isArray(queries)) {
			queries.forEach(function(query) {
				if(query.constructor.toString() !== Query.toString()) 
					throw new Error('Expected ' + query.constructor.toString() + ' to equal: ' + Query.toString());
			});
			queryStack  = queryStack.concat(queries);
			return queryStack.length;
		} else
			throw new Error('Input must be an array of Query objects.');
	}

	/**
	 * 
	 * @param {object} query
	 * @returns {number} stackLength
	 */
	function addQuery(query) {
		if(query.constructor.toString() === Query.toString()) {
			var newLength = queryStack.push(query);
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
		return queryStack;
	}

	function getNextQuery() {
		return queryStack[0];
	}

	function getStackLength() {
		return queryStack.length;
	}

	function removeAllQueries() {
		if(queryStack.length > 0) {
			var result = queryStack;
			queryStack = [];
			return result;
		} else {
			queryStack = [];
			return null;
		}
	}

	function removeNextQuery() {
		if(queryStack.length > 0) 
			return queryStack.shift();
		else {
			queryStack = [];
			return null;
		}
	}

	function runAllQueries(callback) {
		var queryResults = [];
		async.each(queryStack, function(query, callback) {
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
				var queryStack = [];
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
		getStackLength: getStackLength,
		removeAllQueries: removeAllQueries,
		removeNextQuery: removeNextQuery,
		runAllQueries: runAllQueries
	};

}());
