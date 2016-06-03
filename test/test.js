var assert = require('chai').assert;
var gcloud = require('gcloud');
var datastore = require('./../index');
var Query = require('./../node_modules/gcloud/lib/datastore/query');
var gcloudDatastore = gcloud.datastore();

describe('datastore', function() {

	var queries = [
		// kinds:
		'Book',
		'Movie',
		'TV Show',
		'Song'
	].map(function(kind) {
		return gcloudDatastore.createQuery(kind);
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
		assert.isObject(datastore);
	});

	it('should have an\'addQueries\' method', function() {
		assert.property(datastore, 'addQueries');
		assert.isFunction(datastore.addQueries);
	});

	it('should have an\'addQuery\' method', function() {
		assert.property(datastore, 'addQuery');
		assert.isFunction(datastore.addQuery);
	});

	it('should have a \'createQuery\' method', function() {
		assert.property(datastore, 'createQuery');
		assert.isFunction(datastore.createQuery);
	});

	it('should have a \'getAllQueries\' method', function() {
		assert.property(datastore, 'getAllQueries');
		assert.isFunction(datastore.getAllQueries);
	});

	it('should have a \'getNextQuery\' method', function() {
		assert.property(datastore, 'getNextQuery');
		assert.isFunction(datastore.getNextQuery);
	});

	it('should have a \'getQueueLength\' method', function() {
		assert.property(datastore, 'getQueueLength');
		assert.isFunction(datastore.getQueueLength);
	});

	it('should have an \'removeAllQueries\' method', function() {
		assert.property(datastore, 'removeAllQueries');
		assert.isFunction(datastore.removeAllQueries);
	});

	it('should have a \'removeNextQuery\' method', function() {
		assert.property(datastore, 'removeNextQuery');
		assert.isFunction(datastore.removeNextQuery);
	});

	it('should have a \'runAllQueries\' method', function() {
		assert.property(datastore, 'runAllQueries');
		assert.isFunction(datastore.runAllQueries);
	});

	it('should not have access to the \'queryQueue\' array', function() {
		assert.notProperty(datastore, 'queryQueue');
	});

	describe('addQueries', function() {

		it('should throw an error when the input is not an array of Query objects', function() {
			notQueries.forEach(function(notQuery) {
				assert.throws(function() {
					var queueLength = datastore.addQueries(notQuery);
				}, Error);
			});
		});
		
		it('should return a positive integer representing the number of queries in the queue when an array of new queries is successfully added', function() {
			assert.doesNotThrow(function() {
				var queueLength = datastore.addQueries(queries);
				assert.isNumber(queueLength);
				assert.operator(queueLength, '>', 0);
				assert.equal(queueLength, Math.round(queueLength));
			}, Error);
		});

	});

	describe('addQuery', function() {

		before(function() {
			datastore.removeAllQueries();
		});

		it('should throw an error when the input is not a Query object', function() {
			notQueries.forEach(function(notQuery) {
				
				assert.throws(function() {
					var queueLength = datastore.addQuery(notQuery);
				}, Error);
			});
		});

		it('should return a positive integer representing the number of queries in the queue when a new query is successfully added', function() {
			queries.forEach(function(query) {
				assert.doesNotThrow(function() {
					var queueLength = datastore.addQuery(query);
					assert.isNumber(queueLength);
					assert.operator(queueLength, '>', 0);
					assert.equal(queueLength, Math.round(queueLength));
				}, Error);
			});
		});

	});

	describe('createQuery', function() {

		// indices
		var namespace = 0;
		var kind = 1;

		it('should return a Query object when the inputs are of type string or kind is null', function() {
			var inputs = [
				// inputs:
				'Animal',
				['Canada', 'Animals']
			].forEach(function(input) {
				var query = input.isString ?
					datastore.createQuery(input) :
					datastore.createQuery(input[namespace], input[kind]);
				assert.isObject(query);
				assert.equal(query.constructor.toString(), Query.toString());
			});
		});

		it('should throw an Error when namespace is not of type string or kind is not of type string or null', function() {
			var inputs = [
				function() {},
				4329845,
				[],
				undefined
			].forEach(function(input) {
				assert.throws(function() {
					datastore.createQuery(input);
				}, Error);
			});

		});

	});

	describe('getAllQueries', function() {

		before(function() {
			datastore.addQueries(queries);
		});

		it('should return an array of queries when the queue is populated', function() {
			assert.doesNotThrow(function() {
				var queries = datastore.getAllQueries();
				assert.isArray(queries);
				queries.forEach(function(query) {
					assert.isObject(query);
					assert.equal(query.constructor.toString(), Query.toString());
				});
			}, Error);
		});

		it('should return null if the queue is empty', function() {
			datastore.removeAllQueries();
			assert.equal(datastore.getQueueLength(), 0);
			var queries = datastore.removeAllQueries();
			assert.isNull(queries);
		});

	});

	describe('getNextQuery', function() {

		before(function() {
			datastore.addQueries(queries);
		});

		it('should return a query when the queue is populated', function() {
			assert.doesNotThrow(function() {
				var query = datastore.getNextQuery();
				assert.isObject(query);
				assert.equal(query.constructor.toString(), Query.toString());
			}, Error);
		});

		it('should return null if the queue is empty', function() {
			datastore.removeAllQueries();
			assert.equal(datastore.getQueueLength(), 0);
			var query = datastore.getNextQuery();
			assert.isNull(query);
		});

	});

	describe('getQueueLength', function() {

		it('should return an integer value greater than or equal to 0', function() {
			assert.doesNotThrow(function() {
				var queueLength = datastore.getQueueLength();
				assert.isNumber(queueLength);
				assert.operator(queueLength, '>=', 0);
				assert.equal(queueLength, Math.round(queueLength));
			}, Error);
		});

	});

	describe('removeAllQueries', function() {

		before(function() {
			datastore.addQueries(queries);
		});

		it('should return an array containing all of the queries emptied from the populated queue', function() {
			assert.doesNotThrow(function() {
				var queries = datastore.removeAllQueries();
				var queueLength = datastore.getQueueLength();
				assert.equal(queueLength, 0);
				assert.isArray(queries);
				queries.forEach(function(query) {
					assert.isObject(query);
					assert.equal(query.constructor.toString(), Query.toString());
				});
			}, Error);
			
		});

		it('should return null when the queue is empty', function() {
			assert.equal(datastore.getQueueLength(), 0);
			var queries = datastore.removeAllQueries();
			assert.isNull(queries);
		});

	});

	describe('removeNextQuery', function() {

		before(function() {
			// Add an arbitrary query
			datastore.addQuery(queries[0]);
		});

		it('should return a query when the queue is populated', function() {
			var initalQueueLength = datastore.getQueueLength();
			assert.doesNotThrow(function() {
				var query = datastore.removeNextQuery();
				assert.isObject(query);
				assert.equal(query.constructor.toString(), Query.toString());
			}, Error);
			assert.equal(initalQueueLength - 1, datastore.getQueueLength());
		});

		it('should return null when the queue is empty', function() {
			assert.equal(datastore.getQueueLength(), 0);
			var query = datastore.removeNextQuery();
			assert.isNull(query);
		});

	});

});
