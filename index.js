/**
 * This module is a wrapper for Google's gcloud module that is made specifically
 * to interact with the Google Developer Cloud Datastore.
 *
 * @author Zack Harley @zackharley
 */

var async = require('async');
var gcloud = require('gcloud');
var gcloudDatastore = gcloud.datastore();
var Query = require('./node_modules/gcloud/lib/datastore/query');

module.exports = (function() {

	/**
	 * The stack used to store any queries that will be executed.
	 * 
	 * @type{object}
	 * @private
	 */
	var queryStack = [];

	/**
	 * A function used to add an array of queries to the stack.
	 * 
	 * @param {object} queries - An array of query objects to be added to the
	 * stack.
	 * @return {number} The new length of the stack after the queries have been
	 * inserted.
	 *
	 * @example
	 * var animalQuery = datastore.createQuery('Animal');
	 * var movieQuery = datastore.createQuery('Movie');
	 * var queries = [animalQuery, movieQuery];
	 *
	 * var queueLength = datastore.addAllQueries(queries);
	 */
	function addQueries(queries, callback) {
		if(Array.isArray(queries)) {
			queries.forEach(function(query) {
				if(query.constructor.toString() !== Query.toString()) 
					throw new Error('Expected ' + query.constructor.toString()
						+ ' to equal: ' + Query.toString());
			});
			queryStack  = queryStack.concat(queries);
			return queryStack.length;
		} else
			throw new Error('Input must be an array of Query objects.');
	}

	/**
	 * A function used to add one query to the stack.
	 * 
	 * @param {object} query - A query object to be added to the stack.
	 * @return {number} The new length of the stack after the query has been
	 * inserted.
	 *
	 * @example
	 * var animalQuery = datastore.createQuery('Animal');
	 * 
	 * var queueLength = datastore.addQuery(animalQuery);
	 */
	function addQuery(query) {
		if(query.constructor.toString() === Query.toString()) {
			var newLength = queryStack.push(query);
			return newLength;
		} else
			throw new Error('Expected ' + query.constructor.toString() +
				' to equal: ' + Query.toString());
	}

	/**
	 * A function used to create a new Query object.
	 * 
	 * @param {string=} namespace - An optional namespace to use for the query.
	 * @param {string} kind - The kind to use for the query.
	 * @return {Query} A new Query object.
	 * 
	 * @example
	 * var animalQuery = datastore.createQuery('Animal');
	 */
	function createQuery(namespace, kind) {
		if(typeof namespace === 'string' && !kind) {
			kind = namespace;
			return gcloudDatastore.createQuery(kind);
		} else if(typeof namespace === 'string' && typeof kind === 'string')
			return gcloudDatastore.createQuery(namespace, kind);
		else
			throw new Error('Expected inputs to be of type [String]');
	}

	/**
	 * A function used to get an array containing all of the queries currently
	 * in the stack.
	 *
	 * @return {object} An array containing all of the queries currently stored
	 * in the stack.
	 *
	 * @example
	 * var queries = datastore.getAllQueries();
	 */
	function getAllQueries() {
		return queryStack.length > 0 ? queryStack : null;
	}

	/**
	 * A function used to get the next query to be run in the stack, based on
	 * the FIFO model.
	 * 
	 * @return {Query} The next query to be run in the stack.
	 *
	 * @example
	 * var query = datastore.getNextQuery();
	 */
	function getNextQuery() {
		return queryStack.length > 0 ? queryStack[0] : null;
	}

	/**
	 * A function used to get the length of the stack.
	 *
	 * @return {number} The length of the stack.
	 *
	 * @example
	 * var queueLength = datastore.getQueueLength();
	 */
	function getStackLength() {
		return queryStack.length;
	}

	/**
	 * A function used to remove all of the queries from the stack.
	 * This function acts in a similar manner to the `getAllQueries` function,
	 * but empties the stack as well as retrieving all of the queries currently
	 * in the stack.
	 * 
	 * @return {object} An array containing all of the queries that were removed
	 * from the stack.
	 *
	 * @example
	 * var queries = datastore.removeAllQueries();
	 */
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

	/**
	 * A function used to the next query from the stack, based on the FIFO model.
	 * This function acts in a similar manner to the `getNextQuery` function, but
	 * removes the next query from the stack as well as retrieving it.
	 *
	 * @return {Query} The query object that was removed from the stack.
	 *
	 * @example
	 * var query = datastore.removeNextQuery();
	 */
	function removeNextQuery() {
		if(queryStack.length > 0) 
			return queryStack.shift();
		else {
			queryStack = [];
			return null;
		}
	}

	/**
	 * A function used to execute all of the queries from the stack against the
	 * Datastore.
	 *
	 * @param {function} callback - A callback function.
	 * @param {?error} callback.error - The error returned when executing the
	 * query. May be null.
	 * @param {?object} callback.result - The result of running the datastore
	 * queries. May be null.
	 * 
	 * @example
	 * datastore.runAllQueries(function(error, result) {
     *   if(!error){
     *     // do something
     *   }
	 * });
	 */
	function runAllQueries(callback) {
		var queryResults = [];
		async.each(queryStack, function(query, callback) {
			gcloudDatastore.runQuery(query, function(error, result) {
				if(error) return callback(error);
				else {
					queryResults.push(result);
					return callback();
				}
			});
		}, function(error) {
			if(error) return callback(error, null);
			else {
				var queryStack = [];
				return callback(null, queryResults);
			}
		});
	}

	/**
	 * A function used to execute the next query from the stack against the
	 * Datastore.
	 *
	 * @param {function} callback - A callback function.
	 * @param {?error} callback.error - The error returned when executing the
	 * query. May be null.
	 * @param {?object} callback.result - The result of running the datastore
	 * queries. May be null.
	 * 
	 * @example
	 * datastore.runNextQuery(function(error, result) {
     *   if(!error){
     *     // do something
     *   }
	 * });
	 */
	function runNextQuery(callback) {
		gcloudDatastore.runQuery(queryStack[0], function(error, result) {
			if(error) return callback(error);
			else return callback(null, result);
		});
	}

	/**
	 * A function used to execute the inputted query against the Datastore.
	 *
	 * @param {Query} query - A query object to execute.
	 * @param {function} callback - A callback function.
	 * @param {?error} callback.error - The error returned when executing the
	 * query. May be null.
	 * @param {?object} callback.result - The result of running the datastore
	 * queries. May be null.
	 * 
	 * @example
	 * var query = datastore.createQuery('Animal');
	 *
	 * datastore.run(query, function(error, results) {
     *   if(!error){
     *     // do something
     *   }
	 * });
	 */
	function runQuery(query, callback) {
		gcloud.runQuery(query, function(error, result) {
			if(error) return callback(error);
			else return callback(null, result);
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
		runAllQueries: runAllQueries,
		runNextQuery: runNextQuery,
		runQuery: runQuery
	};

}());
