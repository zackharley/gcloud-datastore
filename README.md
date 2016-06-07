# gcloud-datastore {
[![Build Status](https://travis-ci.org/zackharley/gcloud-datastore.svg?branch=master)](https://travis-ci.org/zackharley/gcloud-datastore-query-manager)
[![Code Climate](https://codeclimate.com/github/zackharley/gcloud-datastore-query-manager/badges/gpa.svg)](https://codeclimate.com/github/zackharley/gcloud-datastore-query-manager)

This package is installable by using `npm install --save gcloud-datastore`.


## Using the Query Manager

The idea behind the query manager is a [first-in-first-out](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) stack. The query manager is essentialy a stack that holds query until they are executed. Once executed, all of the results are return in an array.


### Quick Example
Here is how the query manager works, at a very basic level.

##### Sample datastore:

*Kind*: Animal

| id/name      | species       | name  |
| -------------|:-------------:| -----:|
| 871398717813 | lion          | Simba |
| 234885878798 | tiger         | Tony  |
| 873485798374 | bear          | Baloo |

##### Code
```
var datastore = require('gcloud-datastore');

// Synchronous callback
datatore.addQuery(query, function(error, queryStackLength) {
    if(error)
        throw error;
    else
        console.log('There is now ' + queryStackLength + ' query in the stack.');
});

// Asynchronous callback
datastore.runAllQueries(function(error, result) {
    if(error)
        throw error;
    else
        console.log(result);
});
```


## Documentation
### datastore
 * [`addQueries`](#addallqueriesqueries) - Add an array of queries to the stack
 * [`addQuery`](#addqueryquery) - Add one query to the stack
 * [`createQuery`](#createquerynamespace-kind) - Creates and returns a query object
 * [`getAllQueries`](#getallqueries) - Get an array of all of the queries in the stack
 * [`getNextQuery`](#getnextquery) - Get the next query in the stack, based on the FIFO model
 * [`getStackLength`](#getstacklength) - Get the current length of the stack
 * [`removeAllQueries`](#removeallqueries) - Remove all of the queries from the stack
 * [`removeNextQuery`](#removenextquery) - Remove the next query in the stack, based on the FIFO model
 * [`runAllQueries`](#runallqueriescallback) - Run all of the queries in the stack
 * [`runNextQuery`](#runnextquerycallback) - Run the next in the stack
 * [`runQuery`](#runqueryquery-callback) - Run a specific query

## datastore

### addAllQueries(queries)
A function used to add an array of queries to the stack.

__Parameters__
* `queries` - An array of query objects to be added to the stack.

__Returns__
The new length of the stack after the queries have been inserted.

__Example__
```
var animalQuery = datastore.createQuery('Animal');
var movieQuery = datastore.createQuery('Movie');
var queries = [animalQuery, movieQuery];

var stackLength = datastore.addAllQueries(queries);
```


### addQuery(query)
A function used to add one query to the stack.

__Parameters__
* `query` - A query object to be added to the stack.

__Returns__
The new length of the stack after the query has been inserted.

*Example*
```
var animalQuery = datastore.createQuery('Animal');

var stackLength = datastore.addQuery(animalQuery);
```

### createQuery([namespace], kind)
A function used to create a new Query object.

__Parameters__
* `namespace` - An optional namespace to use for the query.
* `kind` - The kind to use for the query.

__Returns__
A new Query object.

*Example*
```
var animalQuery = datastore.createQuery('Animal');
```


### getAllQueries()
A function used to get an array containing all of the queries currently in the stack.

__Returns__
An array containing all of the queries currently stored in the stack.

*Example*
```
var queries = datastore.getAllQueries();
```


### getNextQuery();
A function used to get the next query to be run in the stack, based on the FIFO model.

__Returns__
The next query to be run in the stack.

*Example*
```
var query = datastore.getNextQuery();
```


### getStackLength()
A function used to get the length of the stack.

__Returns__
The length of the stack.

*Example*
```
var stackLength = datastore.getStackLength();
```


### removeAllQueries()
A function used to remove all of the queries from the stack. This function acts in a similar manner to the `getAllQueries` function, but empties the stack as well as retrieving all of the queries currently in the stack.

__Returns__
An array containing all of the queries that were removed from the stack.

*Example*
```
var queries = datastore.removeAllQueries();
```


### removeNextQuery()
A function used to the next query from the stack, based on the FIFO model. This function acts in a similar manner to the `getNextQuery` function, but removes the next query from the stack as well as retrieving it.

__Returns__
The query object that was removed from the stack.

*Example*
```
var query = datastore.removeNextQuery();
```


### runAllQueries(callback)
A function used to execute all of the queries from the stack against the Datastore.

__Parameters__
* `callback(error, result)` - A callback that returns any errors that occured while trying to execute the queries stored in the stack or `null`, and an array individual arrays of results corresponding to each query (or null if there were errors).

*Example*
```
datastore.runAllQueries(function(error, result) {
    if(!error){
        // do something
    }
});
```

### runNextQuery(callback)
A function used to execute the next query from the stack against the Datastore.

__Parameters__
* `callback(error, result)` - A callback that returns any errors that occured while trying to execute the queries stored in the stack or `null`, 

*Example*
```
datastore.runNextQuery(function(error, result) {
    if(!error){
        // do something
    }
});
```


### runQuery(query, callback)
A function used to execute the inputted query against the Datastore.

__Parameters__
* `query` - A query object to execute.
* `callback(error, result)` - A callback that returns any errors that occured while trying to execute the queries stored in the stack or `null`, 

*Example*
```
var query = datastore.createQuery('Animal');

datastore.runQuery(query, function(error, result) {
    if(!error){
        // do something
    }
});
```

## License

MIT

> Fork away!

# }