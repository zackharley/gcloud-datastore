# gcloud-datastore-query-manager

A query manager for accessing Google Datastore through Node applications. This package is installable by using `npm install --save gcloud-datastore-query-manager`.

## Using the Query Manager

The idea behind the query manager is a [first-in-first-out](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) queue. The query manager is essentialy a queue that holds query until they are executed. Once executed, all of the results are return in an array.

As this is a query manager for the `gcloud` package, you must ensure that you include `gcloud` wherever you want to use the query manager:

```
var gcloud = require('gcloud');
var datastore = gcloud.datastore();
```

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
// Synchronous callback
queryManager.add(query, function(error, queryStackLength) {
    if(error)
        throw error;
    else
        console.log('There is now ' + queryStackLength + ' query in the stack.');
});

// Asynchronous callback
queryManager.runAll(function(error, result) {
    if(error)
        throw error;
    else
        console.log(result);
});
```


## Documentation
### queryManager
 * [`addAll`](#addall) - Add an array of queries to the queue
 * [`addOne`](#addone) - Add one query to the queue
 * [`getAll`](#getall) - Get an array of all of the queries in the queue
 * [`getNext`](#getnext) - Get the next query in the queue, based on the FIFO model
 * [`getQueueLength`](#getqueuelength) - Get the current length of the queue
 * [`removeAll`](#removeall) - Remove all of the queries from the queue
 * [`removeNext`](#removenext) - Remove the next query in the queue, based on the FIFO model
 * [`runAll`](#runall) - Run all of the queries in the queue


## queryManager
### addAll(queries, callback)
A function used to add an array of queries to the queue.
__Parameters__
* `queries` - An array of query objects to be added to the queue.
* `callback(error, queueLength)` - A callback that returns any errors that occured while inserting the queries to the queue or `null`, and the length of the queue after the queries were succesfully added (or null if there were errors).

**Note** that while this function does take a callback function, the operations it performs are *synchronous*, so the callback is not always necessary.

__Example__
```
var animalQuery = datastore.createQuery('Animal');
var movieQuery = datastore.createQuery('Movie');
var queries = [animalQuery, movieQuery];

queryManager.addAll(queries, function(error, queueLength) {
    if(error)
        throw error;
    else
        console.log('Queue length: ' + queueLength);
});
```

### addOne(query, callback)
A function used to add one query to the queue.
__Parameters__
* `query` - A query object to be added to the queue.
* `callback(error, queueLength)` - A callback that returns any errors that occured while inserting the queries to the queue or `null`, and the length of the queue after the query was succesfully added (or null if there were errors).

**Note** that while this function does take a callback function, the operations it performs are *synchronous*, so the callback is not always necessary.

*Example*
```
var animalQuery = datastore.createQuery('Animal');

queryManager.addOne(animalQuery, function(error, queueLength) {
    if(!error) {
        // do something
    }
});
```
### getAll(callback)

**Note** that while this function does take a callback function, the operations it performs are *synchronous*, so the callback is not always necessary.

*Example*
```
queryManager.getAll(function(error, queries) {
    if(!error){
        // do something
    }
});
```
### getNext(callback);

**Note** that while this function does take a callback function, the operations it performs are *synchronous*, so the callback is not always necessary.

*Example*
```
queryManager.getNext(function(error, query) {
    if(!error){
        // do something
    }
});
```
### getQueueLength(callback)

**Note** that while this function does take a callback function, the operations it performs are *synchronous*, so the callback is not always necessary.

*Example*
```
queryManager.getQueueLength(function(error, queueLength) {
    if(!error){
        // do something
    }
});
```
### removeAll(callback)

**Note** that while this function does take a callback function, the operations it performs are *synchronous*, so the callback is not always necessary.

*Example*
```
queryManager.removeAll(function(error, queries) {
    if(!error){
        // do something
    }
});
```
### removeNext(callback)

**Note** that while this function does take a callback function, the operations it performs are *synchronous*, so the callback is not always necessary.

*Example*
```
queryManager.removeNext(function(error, query) {
    if(!error){
        // do something
    }
});
```
### runAll(callback)
*Example*
```
queryManager.run(function(error, results) {
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
