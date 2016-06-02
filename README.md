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


### Methods
#### queryManager
 * [`addAll`](#addAll) - Add an array of queries to the queue
 * [`addOne`](#addOne) - Add one query to the queue
 * [`getAll`](#getAll) - Get an array of all of the queries in the queue
 * [`getNext`](#getNext) - Get the next query in the queue, based on the FIFO model
 * [`getQueueLength`](#getQueueLength) - Get the current length of the queue
 * [`removeAll`](#removeAll) - Remove all of the queries from the queue
 * [`removeNext`](#removeNext) - Remove the next query in the queue, based on the FIFO model
 * [`runAll`](#runAll) - Run all of the queries in the queue

##### addAll

##### addOne

##### getAll
##### getNext
##### getQueueLength
##### removeAll
##### removeNext
##### runAll
