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

	it('should have a \'getStackLength\' method', function() {
		assert.property(datastore, 'getStackLength');
		assert.isFunction(datastore.getStackLength);
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

	it('should have a \'runNextQuery\' method', function() {
		assert.property(datastore, 'runNextQuery');
		assert.isFunction(datastore.removeNextQuery);
	});

	it('should have a \'runQuery\' method', function() {
		assert.property(datastore, 'runQuery');
		assert.isFunction(datastore.runQuery);
	});

	it('should not have access to the \'queryStack\' array', function() {
		assert.notProperty(datastore, 'queryStack');
	});

	describe('addQueries', function() {

		it('should throw an error when the input isn\'t an array', function() {
			assert.throws(function() {
				var stackLength = datastore.addQueries('Test');
			}, Error);
		});

		it('should throw an error when the input is an array, but contains values other than Query objects', function() {
			assert.throws(function() {
				var stackLength = datastore.addQueries(notQueries);
			}, Error);
		});

		it('should return a positive integer representing the number of queries in the stack when an array of new queries is successfully added', function() {
			assert.doesNotThrow(function() {
				var stackLength = datastore.addQueries(queries);
				assert.isNumber(stackLength);
				assert.operator(stackLength, '>', 0);
				assert.equal(stackLength, Math.round(stackLength));
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
					var stackLength = datastore.addQuery(notQuery);
				}, Error);
			});
		});

		it('should return a positive integer representing the number of queries in the stack when a new query is successfully added', function() {
			queries.forEach(function(query) {
				assert.doesNotThrow(function() {
					var stackLength = datastore.addQuery(query);
					assert.isNumber(stackLength);
					assert.operator(stackLength, '>', 0);
					assert.equal(stackLength, Math.round(stackLength));
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
				var query;
				if(typeof input == 'string')
					query = datastore.createQuery(input);
				else
					query = datastore.createQuery(input[namespace], input[kind]);
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

		it('should return an array of queries when the stack is populated', function() {
			var queries = datastore.getAllQueries();
			assert.isArray(queries);
			queries.forEach(function(query) {
				assert.isObject(query);
				assert.equal(query.constructor.toString(), Query.toString());
			});
		});

		it('should return null if the stack is empty', function() {
			datastore.removeAllQueries();
			assert.equal(datastore.getStackLength(), 0);
			var queries = datastore.getAllQueries();
			assert.isNull(queries);
		});

	});

	describe('getNextQuery', function() {

		before(function() {
			datastore.addQueries(queries);
		});

		it('should return a query when the stack is populated', function() {
			assert.doesNotThrow(function() {
				var query = datastore.getNextQuery();
				assert.isObject(query);
				assert.equal(query.constructor.toString(), Query.toString());
			}, Error);
		});

		it('should return null if the stack is empty', function() {
			datastore.removeAllQueries();
			assert.equal(datastore.getStackLength(), 0);
			var query = datastore.getNextQuery();
			assert.isNull(query);
		});

	});

	describe('getStackLength', function() {

		it('should return an integer value greater than or equal to 0', function() {
			assert.doesNotThrow(function() {
				var stackLength = datastore.getStackLength();
				assert.isNumber(stackLength);
				assert.operator(stackLength, '>=', 0);
				assert.equal(stackLength, Math.round(stackLength));
			}, Error);
		});

	});

	describe('removeAllQueries', function() {

		before(function() {
			datastore.addQueries(queries);
		});

		it('should return an array containing all of the queries emptied from the populated stack', function() {
			assert.doesNotThrow(function() {
				var queries = datastore.removeAllQueries();
				var stackLength = datastore.getStackLength();
				assert.equal(stackLength, 0);
				assert.isArray(queries);
				queries.forEach(function(query) {
					assert.isObject(query);
					assert.equal(query.constructor.toString(), Query.toString());
				});
			}, Error);

		});

		it('should return null when the stack is empty', function() {
			assert.equal(datastore.getStackLength(), 0);
			var queries = datastore.removeAllQueries();
			assert.isNull(queries);
		});

	});

	describe('removeNextQuery', function() {

		before(function() {
			// Add an arbitrary query
			datastore.addQuery(queries[0]);
		});

		it('should return a query when the stack is populated', function() {
			var initalStackLength = datastore.getStackLength();
			assert.doesNotThrow(function() {
				var query = datastore.removeNextQuery();
				assert.isObject(query);
				assert.equal(query.constructor.toString(), Query.toString());
			}, Error);
			assert.equal(initalStackLength - 1, datastore.getStackLength());
		});

		it('should return null when the stack is empty', function() {
			assert.equal(datastore.getStackLength(), 0);
			var query = datastore.removeNextQuery();
			assert.isNull(query);
		});

	});

	describe('runAllQueries', function() {

		// before(function() {
		// 	datastore.addQueries(queries);
		// });

		// Test querying against the emulator
		// it('should return an array of results when there are queries in the stack', function() {

		// });

		// it('should cause the stack to be empty after being run successfully', function() {
		// 	assert.equal(datastore.getStackLength(), 0);
		// });

		it('should return an empty array when no queries have been added to the stack', function() {
			datastore.runAllQueries(function(error, result) {
				assert.equal(error, null);
				assert.isArray(result);
				assert.equal(result.length, 0);
			});
		});

	});

	describe('runNextQuery', function() {

    var originalStackLength;

    // before(function() {
    //  datastore.addQueries(queries);
    //  originalStackLength = datastore.getStackLength();
    // });

		// Test querying against the emulator
    // it('should return an object containing results from running the query', function() {

    // });

    // it('should cause the stack to conatain one less Query after being run successfully', function() {
    //   assert.equal(datastore.getStackLength(), originalStackLength - 1);
    // });

	});

	describe('runQuery', function() {

	});

});
