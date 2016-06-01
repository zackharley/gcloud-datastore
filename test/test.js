var assert = require('chai').assert;
var gcloud = require('gcloud');
var queryManager = require('./../index');
var Query = require('./../node_modules/gcloud/lib/datastore/query');
var datastore = gcloud.datastore();

describe('queryManager', function() {

	var queries = [
		// kinds:
		'Book',
		'Movie',
		'TV Show',
		'Song'
	].map(function(kind) {
		return datastore.createQuery(kind);
	});

	it('should be an object', function() {
		assert.isObject(queryManager);
	});

	it('should have an\'add\' method', function() {
		assert.isFunction(queryManager.add);
	});

	it('should have an \'empty\' method', function() {
		assert.isFunction(queryManager.empty);
	});

	it('should have a \'get\' method', function() {
		assert.isFunction(queryManager.get);
	});

	it('should have a \'remove\' method', function() {
		assert.isFunction(queryManager.remove);
	});

	it('should have a \'run\' method', function() {
		assert.isFunction(queryManager.get);
	});

	describe('add', function() {

		it('should return an integer value representing the number of queries in the stack when a new query is successfully added', function() {
			queries.forEach(function(query) {
				queryManager.add(query, function(err, numOfQueries) {
					assert.isNull(err);
					assert.equal(numOfQueries, Math.round(numOfQueries));
				});
			});
		});

	});

	describe('empty', function() {

		it('should return an array containing all of the queries emptied from the populated stack', function() {
			queryManager.empty(function(err, queries) {
				assert.isNull(err);
				assert.isArray(queries);
				queries.forEach(function(query) {
					assert.instanceOf(query, Query);
				});
			});
		});

		it('should return an error when the stack is empty', function() {
			queryManager.empty(function(err, queries) {
				assert.instanceOf(err, Error);
				assert.isNull(queries);
			});
		});

	});

	describe('get', function() {

		before(function() {
			queries.forEach(function(query) {
				queryManager.add(query, function() {});
			});
		});

		it('should return an array of queries when the stack is populated', function() {
			queryManager.get(function(err, queries) {
				assert.isNull(err);
				assert.isArray(queries);
				queries.forEach(function(query) {
					assert.instanceOf(query, Query);
				});
			});
		});

		it('should throw an error if the stack is empty', function() {
			queryManager.empty(function() {});
			queryManager.get(function(err, queries) {
				assert.instanceOf(err, Error);
				assert.isNull(queries);
			});
		});

	});

	describe('remove', function() {

		before(function() {
			// Add an arbitrary query
			queryManager.add(queries[0], function() {});
		});

		it('should return a query when the stack is populated', function() {
			queryManager.remove(function(err, query) {
				assert.isNull(err);
				assert.instanceOf(query, Query);
			});
		});

		it('should return an error when the stack is empty', function() {
			queryManager.remove(function(err, query) {
				assert.instanceOf(err, Error);
				assert.isNull(query);
			});
		});

	});

});
