# higher-docker-manager [![Build Status](https://img.shields.io/travis/SoftwareMarbles/higher-docker-manager.svg?style=flat)](https://travis-ci.org/SoftwareMarbles/higher-docker-manager)

Docker management package with higher-level functions

# higher-docker-manager

HigherDockerManager is built on top of [node-docker-api](https://www.npmjs.com/package/node-docker-api) offering some higher-order management [functions](#features). `node-docker-api` is not included as dependency but referenced as a peer dependency.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save higher-docker-manager node-docker-api@^1.1.2
```

## Usage

```js
const HigherDockerManager = require('higher-docker-manager');

return HigherDockerManager.pullImage({}, 'hello-world:latest')
    .then(() => HigherDockerManager.runTemporaryContainer({
        image: 'hello-world:latest'
    }))
    .then((output) => {
        assert(_.isArray(output));
        assert(output[1].payload, 'Hello from Docker!\n');
    });
```

## Features

* Pulling an image from a repository
* Finding process's own container if its running in Docker
* Running a temporary container
* Executing a command in a running container
* Finding containers by networks, labels and images
* Finding volumes by labels and their values
* Finding networks by labels and their values

## API

HigherDockerManager class offers functions to manage docker images, volumes and containers.

Registers image with the given name and tag with Docker.

**Params**

* `auth` **{Object}**: Authentication structure per Docker API documentation    
* `name` **{string}**: Name of the image to be pulled from Docker registry. This may contain the tag as well in which case the actual passed `tag` param will be ignored.    
* `tag` **{string}**: Tag of the image to be pulled from Docker registry    
* `returns` **{Promise}**: Promise returning pulled image  

Returns container in which the process is running. If the process is not in a container
then `null` is returned.

* `returns` **{Promise}**: Promise resolving with the process's container or `null`.  

Returns containers that are on the given networks.

**Params**

* `networks` **{Array|Object}**: Array of network names or Networks Docker JSON as returned by `status` function.    
* `returns` **{Promise}**: Promise resolving with array of matching containers which may be empty.  

Creates a new volume with the given params.

**Params**

* `params` **{Object}**: Paraters of the volume to be created per Docker API.    
* `returns` **{Promise}**: Promise resolving with created volume object.  

Creates a new container with the given params.

**Params**

* `params` **{Object}**: Paraters of the container to be created per Docker API.    
* `returns` **{Promise}**: Promise resolving with created container object.  

Creates a new network with the given params.

**Params**

* `params` **{Object}**: Paraters of the network to be created per Docker API.    
* `returns` **{Promise}**: Promise resolving with created container object.  

Searches for all the volumes with the given label name and value.

**Params**

* `labelName` **{string}**: The name of the label which we are searching.    
* `labelValue` **{string}**: The value of the lable which we are searching.    
* `returns` **{Promise}**: Promise resolving with the array of found volumes.  

Searches for all the networks with the given label name and value.

**Params**

* `labelName` **{string}**: The name of the label which we are searching.    
* `labelValue` **{string}**: The value of the lable which we are searching.    
* `returns` **{Promise}**: Promise resolving with the array of found volumes.  

Searches for the network with the given name or ID.

**Params**

* `nameOrId` **{string}**: The name or ID of the network for which we are searching    
* `returns` **{Promise}**: Promise returning the found network if any  

Runs a temporary container with the given parameters, waits for its execution
to end and returns its output as an array of buffers.

**Params**

* `params` **{Object}**: Parameters with which to run a temporary container    
* `returns` **{Promise}**: Primise returning the output of the run in an array of buffers.  

Runs container with the given parameters.

**Params**

* `params` **{Object}**: Parameters for running a new container.    
* `returns` **{Promise}**: Promise fulfilled once new container has been started.  

Searches for the container with the given name or ID.

**Params**

* `nameOrId` **{string}**: The name or ID of the container for which we are searching    
* `returns` **{Promise}**: Promise returning the found container if any  

Finds the container with the given name or ID in the given containers collection.

**Params**

* `containers` **{Array}**: Array of containers in which to try to find the container.    
* `nameOrId` **{string}**: The name or ID of the container for which we are searching.    
* `returns` **{Container}**: Found container if it was found, otherwise `null`.  

Finds the object with the given name or ID in the given collection. Note that this
function doesn't work for containers as they can have more than one name. Use
`findContainerForNameOrId` for containers.

**Params**

* `objects` **{Array}**: Array of objects in which to try to find the object.    
* `nameOrId` **{string}**: The name or ID of the object for which we are searching.    
* `returns` **{Object}**: Found object if it was found, otherwise `null`.  

Searches for all the containers with the given image name.

**Params**

* `imageName` **{string}**: The name of the image including the tag for which we are searching    
* `returns` **{Promise}**: Promise resolving with the array of matching containers.  

Filters all containers with the given image name in the given collection of containers.

**Params**

* `containers` **{Array}**: Array of containers which is being filtered.    
* `imageName` **{string}**: The name of the image including the tag for which we are searching    
* `returns` **{Array}**: Array of matching containers.  

Searches for all the containers with the given label name and value

**Params**

* `labelName` **{string}**: The name of the label which we are searching    
* `labelValue` **{string}**: The value of the lable which we are searching    
* `returns` **{Promise}**: Promise resolving with the array of found containers.  

Filters all the objects with the given label name and value in the given collection of
objects.

**Params**

* `objects` **{Array}**: Array of objects which is being filtered.    
* `labelName` **{string}**: The name of the label which we are filtering.    
* `labelValue` **{string}**: The value of the lable which we are filtering.    
* `returns` **{Array}**: Array of matching objects.  

Executes a command in an already running container.

**Params**

* `container` **{Container}**: Docker container object on which to execute the command    
* `params` **{Object}**: Parameters of the execution    
* `returns` **{Promise}**: Promise returning the output of the execution  

Converts container output buffers into a single string.

**Params**

* `buffers` **{Array}**: Array of Node Buffers output from a Docker container.    
* `returns` **{string}**: String joined out of output extracted from the given buffers.  

## Related projects

[node-docker-api](https://www.npmjs.com/package/node-docker-api): Docker Remote API driver for node | [homepage](https://github.com/AgustinCB/docker-api#readme "Docker Remote API driver for node")

## Author

**Ivan Erceg**

+ [github/ierceg](https://github.com/ierceg)
+ [twitter/ierceg](http://twitter.com/ierceg)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

## Revision history

#### v1.6.0 - 2017-01-08
##### Added
* Generate README with [verb](https://npmjs.com/verb)

##### Changed
* Reference [node-docker-api](https://npmjs.com/node-docker-api) as peer dependency

### License
Copyright © 2017, [Ivan Erceg](https://github.com/ierceg).
Released under the [MIT license](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.3.0, on January 09, 2017._

