# gcloud-datastore
[![Build Status](https://travis-ci.org/zackharley/gcloud-datastore.svg?branch=master)](https://travis-ci.org/zackharley/gcloud-datastore-query-manager)
[![Code Climate](https://codeclimate.com/github/zackharley/gcloud-datastore-query-manager/badges/gpa.svg)](https://codeclimate.com/github/zackharley/gcloud-datastore-query-manager)

This package is installable by using `npm install --save gcloud-datastore`.


## Using the Query Manager

The idea behind the query manager is a [first-in-first-out](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) queue. The query manager is essentialy a queue that holds query until they are executed. Once executed, all of the results are return in an array.


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
datatore.addQuery(query, function(error, queryQueueLength) {
    if(error)
        throw error;
    else
        console.log('There is now ' + queryQueueLength + ' query in the queue.');
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
 * [`addQueries`](#addallqueriesqueries) - Add an array of queries to the queue
 * [`addQuery`](#addqueryquery) - Add one query to the queue
 * [`createQuery`](#createquerynamespace-kind) - Creates and returns a query object
 * [`getAllQueries`](#getallqueries) - Get an array of all of the queries in the queue
 * [`getNextQuery`](#getnextquery) - Get the next query in the queue, based on the FIFO model
 * [`getQueueLength`](#getqueuelength) - Get the current length of the queue
 * [`removeAllQueries`](#removeallqueries) - Remove all of the queries from the queue
 * [`removeNextQuery`](#removenextquery) - Remove the next query in the queue, based on the FIFO model
 * [`runAllQueries`](#runallqueriescallback) - Run all of the queries in the queue


## datastore

### addAllQueries(queries)
A function used to add an array of queries to the queue.

__Parameters__
* `queries` - An array of query objects to be added to the queue.

__Returns__
The new length of the queue after the queries have been inserted.

__Example__
```
var animalQuery = datastore.createQuery('Animal');
var movieQuery = datastore.createQuery('Movie');
var queries = [animalQuery, movieQuery];

var queueLength = datastore.addAllQueries(queries);
```


### addQuery(query)
A function used to add one query to the queue.

__Parameters__
* `query` - A query object to be added to the queue.

__Returns__
The new length of the queue after the query has been inserted.

*Example*
```
var animalQuery = datastore.createQuery('Animal');

var queueLength = datastore.addQuery(animalQuery);
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
A function used to get an array containing all of the queries currently in the queue.

__Returns__
An array containing all of the queries currently stored in the queue.

*Example*
```
var queries = datastore.getAllQueries();
```


### getNextQuery();
A function used to get the next query to be run in the queue, based on the FIFO model.

__Returns__
The next query to be run in the queue.

*Example*
```
var query = datastore.getNextQuery();
```


### getQueueLength()
A function used to get the length of the queue.

__Returns__
The length of the queue.

*Example*
```
var queueLength = datastore.getQueueLength();
```


### removeAllQueries()
A function used to remove all of the queries from the queue. This function acts in a similar manner to the `getAllQueries` function, but empties the queue as well as retrieving all of the queries currently in the queue.

__Returns__
An array containing all of the queries that were removed from the queue.

*Example*
```
var queries = datastore.removeAllQueries();
```


### removeNextQuery(callback)
A function used to the next query from the queue, based on the FIFO model. This function acts in a similar manner to the `getNextQuery` function, but removes the next query from the queue as well as retrieving it.

__Returns__
The query object that was removed from the queue.

*Example*
```
var query = datastore.removeNextQuery();
```


### runAllQueries(callback)
A function used to execute all of the queries from the queue against the Datastore.
__Parameters__
* `callback(error, results)` - A callback that returns any errors that occured while trying to execute the queries stored in the queue or `null`, and an array individuak arrays of results corresponding to each query (or null if there were errors).

*Example*
```
datastore.run(function(error, results) {
    if(!error){
        // do something
    }
});
```



## License
Copyright (c) 2016 Zackery Harley

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
