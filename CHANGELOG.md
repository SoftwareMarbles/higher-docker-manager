
#### v1.6.3 - 2017-01-09
##### Fixed
* Limited package to require node 6 and later.
* Limited tests to run on node 6 and later.
* Fixed failing tests due to lack of node-docker-api in dev dependencies.

#### v1.6.2 - 2017-01-09
##### Added
* Mocha to dev dependencies.

#### v1.6.1 - 2017-01-09
##### Changed
* Tests are mocked with nock instead of making actual requests to Docker. It's hacky but it will do for now.

#### v1.6.0 - 2017-01-08
##### Added
* Generate README with [verb](https://npmjs.com/verb)

##### Changed
* Reference [node-docker-api](https://npmjs.com/node-docker-api) as peer dependency
