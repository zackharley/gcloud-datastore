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

	var notQueries = [
		'This isn\'t a Query object',
		1234,
		new Date(),
		function(){
			console.log('This shouldn\'t be here');
		},
		[
			'This is still a string',
			4321,
			{
				prop: 'an object'
			}
		]
	];

	it('should be an object', function() {
		assert.isObject(queryManager);
	});

	it('should have an\'addOne\' method', function() {
		assert.property(queryManager, 'addOne');
		assert.isFunction(queryManager.addOne);
	});

	it('should have an\'addAll\' method', function() {
		assert.property(queryManager, 'addAll');
		assert.isFunction(queryManager.addAll);
	});

	it('should have a \'getAll\' method', function() {
		assert.property(queryManager, 'getAll');
		assert.isFunction(queryManager.getAll);
	});

	it('should have a \'getNext\' method', function() {
		assert.property(queryManager, 'getNext');
		assert.isFunction(queryManager.getNext);
	});

	it('should have a \'getQueueLength\' method', function() {
		assert.property(queryManager, 'getQueueLength');
		assert.isFunction(queryManager.getQueueLength);
	});

	it('should have an \'removeAll\' method', function() {
		assert.property(queryManager, 'removeAll');
		assert.isFunction(queryManager.removeAll);
	});

	it('should have a \'removeNext\' method', function() {
		assert.property(queryManager, 'removeNext');
		assert.isFunction(queryManager.removeNext);
	});

	it('should have a \'runAll\' method', function() {
		assert.property(queryManager, 'runAll');
		assert.isFunction(queryManager.runAll);
	});

	it('should not have access to the \'queryQueue\' array', function() {
		assert.notProperty(queryManager, 'queryQueue');
	});

	describe('addAll', function() {

		before(function() {
			queryManager.removeAll(function() {});
		});

		it('should return an error when the input is not an array of Query objects', function() {
			notQueries.forEach(function(notQuery) {
				queryManager.addOne(notQuery, function(error, queryQueueLength) {
					assert.instanceOf(error, Error);
					assert.isNull(queryQueueLength);
				});
			});
		});
		
		it('should return a positive integer representing the number of queries in the queue when an array of new queries is successfully added', function() {
			queryManager.addAll(queries, function(error, queryQueueLength) {
				assert.isNull(error);
				assert.isNumber(queryQueueLength);
				assert.operator(queryQueueLength, '>', 0);
				assert.equal(queryQueueLength, Math.round(queryQueueLength));
			});
		});

	});

	describe('addOne', function() {

		it('should return an error when the input is not a Query object', function() {
			notQueries.forEach(function(notQuery) {
				queryManager.addOne(notQuery, function(error, queryQueueLength) {
					assert.instanceOf(error, Error);
					assert.isNull(queryQueueLength);
				});
			});
		});

		it('should return a positive integer representing the number of queries in the queue when a new query is successfully added', function() {
			queries.forEach(function(query) {
				queryManager.addOne(query, function(error, queryQueueLength) {
					assert.isNull(error);
					assert.isNumber(queryQueueLength);
					assert.operator(queryQueueLength, '>', 0);
					assert.equal(queryQueueLength, Math.round(queryQueueLength));
				});
			});
		});

	});

	describe('getAll', function() {

		before(function() {
			queryManager.addAll(queries, function(){});
		});

		it('should return an array of queries when the queue is populated', function() {
			queryManager.getAll(function(error, queries) {
				assert.isNull(error);
				assert.isArray(queries);
				queries.forEach(function(query) {
					assert.instanceOf(query, Query);
				});
			});
		});

		it('should throw an error if the queue is empty', function() {
			queryManager.removeAll(function(error, queries) {});
			queryManager.getAll(function(error, queries) {
				assert.instanceOf(error, Error);
				assert.isNull(queries);
			});
		});

	});

	describe('getNext', function() {

		before(function() {
			queryManager.addAll(queries, function() {});
		});

		it('should return a query when the queue is populated', function() {
			queryManager.getNext(function(error, query) {
				assert.isNull(error);
				assert.isObject(query);
				assert.instanceOf(query, Query);
			});
		});

		it('should throw an error if the queue is empty', function() {
			queryManager.removeAll(function() {});
			queryManager.getNext(function(error, query) {
				assert.instanceOf(error, Error);
				assert.isNull(query);
			});
		});

	});

	describe('getQueueLength', function() {

		it('should return an integer value greater than or equal to 0', function() {
			queryManager.getQueueLength(function(error, queryQueueLength) {
				assert.isNull(error);
				assert.isNumber(queryQueueLength);
				assert.operator(queryQueueLength, '>=', 0);
				assert.equal(queryQueueLength, Math.round(queryQueueLength));
			});
		});

	});

	describe('removeAll', function() {

		before(function() {
			queryManager.addAll(queries, function() {});
		});

		it('should return an array containing all of the queries emptied from the populated queue', function() {
			queryManager.removeAll(function(error, queries) {
				assert.isNull(error);
				assert.isArray(queries);
				queries.forEach(function(query) {
					assert.instanceOf(query, Query);
				});
			});
			queryManager.getQueueLength(function(error, queryQueueLength) {
				assert.isEqual(queryQueueLength, 0);
			});
		});

		it('should return an error when the queue is empty', function() {
			queryManager.removeAll(function(error, queries) {
				assert.instanceOf(error, Error);
				assert.isNull(queries);
			});
		});

	});

	describe('removeNext', function() {

		before(function() {
			// Add an arbitrary query
			queryManager.addOne(queries[0], function() {});
		});

		it('should return a query when the queue is populated', function() {
			var initalQueueLength;
			queryManager.getQueueLength(function(error, queryQueueLength) {
				initalQueueLength = queryQueueLength;
			});
			queryManager.removeNext(function(error, query) {
				assert.isNull(error);
				assert.instanceOf(query, Query);
			});
			queryManager.getQueueLength(function(error, queryQueueLength) {
				assert.equal(initalQueueLength - 1, queryQueueLength);
			});
		});

		it('should return an error when the queue is empty', function() {
			queryManager.removeNext(function(error, query) {
				assert.instanceOf(error, Error);
				assert.isNull(query);
			});
		});

	});

});
