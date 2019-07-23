
'use strict';

/**
 * @module HigherDockerManager
 */

const _ = require('lodash');
const Docker = require('node-docker-api').Docker;
const os = require('os');
const selectn = require('selectn');
const debug = require('debug')('HigherDockerManager:');

let docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

//  According to https://docs.docker.com/engine/reference/api/docker_remote_api_v1.24/#/attach-to-a-container
const DOCKER_OUTPUT_HEADER_FRAME_TYPE_INDEX = 0;
const DOCKER_OUTPUT_HEADER_FRAME_SIZE_INDEX = 4;
const PAYLOAD_HEADER_SIZE = 8;
const DOCKER_OUTPUT_PAYLOAD_INDEX = PAYLOAD_HEADER_SIZE;

const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', _.noop /* do nothing - we need to accept the data showing progress */);
    stream.on('end', resolve);
    stream.on('error', reject);
});

//  Keep running the promises returned by the given action while the given condition returns true.
const asyncWhile = (condition, action) => {
    const whilst = () => (condition() ? action().then(whilst) : Promise.resolve());

    return whilst();
};

/**
 * HigherDockerManager class offers functions to manage docker images, volumes and containers.
 * @api public
 */
class HigherDockerManager {
    /**
     * Registers image with the given name and tag with Docker.
     * @param {Object} `auth` Authentication structure per Docker API documentation
     * @param {string} `givenName` Name of the image to be pulled from Docker registry. This may contain
     * the tag as well in which case the actual passed `tag` param will be ignored.
     * @param {string} `givenTag` Tag of the image to be pulled from Docker registry
     * @return {Promise} Promise returning pulled image
     * @api public
     */
    
    static pullImage(auth, givenName, givenTag) {
        const { name, tag } = HigherDockerManager._getNameTag(givenName, givenTag);

        return docker.image.create(auth, { fromImage: name, tag })
            .then(stream => promisifyStream(stream))
            .then(() => docker.image.status(`${name}:${tag}`));
    }

    /**
     * Returns image with the given name and tag if its available on local Docker.
     * @param {string} `givenName` Name of the image. This may contain
     * the tag as well in which case the actual passed `tag` param will be ignored.
     * @param {string} `givenTag` Tag of the image.
     * @return {Promise} Promise resolving with image or rejecting if no such image
     * @api public
     */
    static getImage(givenName, givenTag) {
        const { name, tag } = HigherDockerManager._getNameTag(givenName, givenTag);

        return docker.image.status(`${name}:${tag}`);
    }

    /**
     * Returns container in which the process is running. If the process is not in a container
     * then `null` is returned.
     * @return {Promise} Promise resolving with the process's container or `null`.
     * @api public
     */
    static getOwnContainer() {
        const hostname = os.hostname();

        return docker.container
            .list({ all: true })
            .then((containers) => {
                let i = 0;
                let ownContainer = null;
                return asyncWhile(
                    () => i < containers.length && _.isNull(ownContainer),
                    () => {
                        const container = containers[i];
                        return container.status()
                            .then((containerStatus) => {
                                //  istanbul ignore else - this test can fail only outside of Docker
                                if (selectn('Config.Hostname', containerStatus) === hostname) {
                                    ownContainer = container;
                                }

                                i += 1;
                            });
                    })
                    .then(() => ownContainer);
            });
    }

    /**
     * Returns containers that are on the given networks.
     * @param {Array|Object} `networks` Array of network names or Networks Docker JSON as returned by
     * `status` function.
     * @return {Promise} Promise resolving with array of matching containers which may be empty.
     * @api public
     */
    static getContainersInNetworks(networks) {
        //  We accept Networks object as it's returned by status(). In that case we
        //  only care about the names of the networks and not their properties.
        let networkNames;
        if (_.isObject(networks) && !_.isArray(networks)) {
            networkNames = _.keys(networks);
        } else {
            networkNames = networks;
        }

        return docker.container
            .list({ all: true })
            .then(containers =>
                //  Retrieve status of all the containers and compare their networks to
                //  the given collection of network names. This is performed in parallel.
                Promise.all(_.map(containers, container =>
                    container.status()
                        //  Get networks.
                        .then(_.curry(selectn)('NetworkSettings.Networks'))
                        //  Get network names.
                        .then(_.keys)
                        //  Compare network names with the given network names.
                        .then(containerNetworks =>
                            _.some(containerNetworks, containerNetworkName =>
                                _.some(networkNames, networkName =>
                                    networkName === containerNetworkName))
                        )
                        //  If any networks matched, return the container.
                        .then((match) => {
                            if (match) {
                                return container;
                            }

                            return undefined;
                        })
                ))
            )
            //  Remove falsy items from the resulting collection.
            .then(_.filter);
    }

    /**
     * Creates a new volume with the given params.
     * @param {Object} `params` Paraters of the volume to be created per Docker API.
     * @return {Promise} Promise resolving with created volume object.
     * @api public
     */
    static createVolume(params) {
        // istanbul ignore next - not tested as simply forwards params to the underlying library
        return docker.volume.create(params);
    }

    /**
     * Creates a new container with the given params.
     * @param {Object} `params` Paraters of the container to be created per Docker API.
     * @return {Promise} Promise resolving with created container object.
     * @api public
     */
    static createContainer(params) {
        // istanbul ignore next - not tested as simply forwards params to the underlying library
        return docker.container.create(params);
    }

    /**
     * Creates a new network with the given params.
     * @param {Object} `params` Paraters of the network to be created per Docker API.
     * @return {Promise} Promise resolving with created container object.
     * @api public
     */
    static createNetwork(params) {
        // istanbul ignore next - not tested as simply forwards params to the underlying library
        return docker.network.create(params);
    }

    /**
     * Searches for all the volumes with the given label name and value.
     * @param {string} `labelName` The name of the label which we are searching.
     * @param {string} `labelValue` The value of the lable which we are searching.
     * @return {Promise} Promise resolving with the array of found volumes.
     * @api public
     */
    static getVolumesForLabel(labelName, labelValue) {
        return docker.volume
            .list()
            .then(_.curry(HigherDockerManager.filterObjectsByLabel)(_, labelName, labelValue));
    }

    /**
     * Searches for all the networks with the given label name and value.
     * @param {string} `labelName` The name of the label which we are searching.
     * @param {string} `labelValue` The value of the lable which we are searching.
     * @return {Promise} Promise resolving with the array of found volumes.
     * @api public
     */
    static getNetworksForLabel(labelName, labelValue) {
        return docker.network
            .list()
            .then(_.curry(HigherDockerManager.filterObjectsByLabel)(_, labelName, labelValue));
    }

    /**
     * Searches for the network with the given name or ID.
     * @param {string} `nameOrId` The name or ID of the network for which we are searching
     * @return {Promise} Promise returning the found network if any
     * @api public
     */
    static getNetworkForNameOrId(nameOrId) {
        return docker.network
            .list()
            .then(_.curry(HigherDockerManager.findObjectForNameOrId)(_, nameOrId));
    }

    /**
     * Runs a temporary container with the given parameters, waits for its execution
     * to end and returns its output as an array of buffers.
     * @param {Object} `params` Parameters with which to run a temporary container
     * @return {Promise} Primise returning the output of the run in an array of buffers.
     * @api public
     */
    static runTemporaryContainer(params) {
        //  Reference to temporary container that we will use for all the operations
        //  once the container has been created.
        let temporaryContainer = null;

        // Schedules and performs the cleanup after the analysis. This operation doesn't
        // fail as there is nothing we can do about failed cleanup. The cleanup is
        // delayed as it is noop from the point of view of the analysis and we want
        // to return the results as soon as possible.
        const scheduleDelayedCleanup = () => {
            setImmediate(() => {
                // istanbul ignore if
                if (!temporaryContainer) {
                    return;
                }

                //  Just in case wait for the container to finish before trying to delete it.
                temporaryContainer.wait()
                    .then(() => temporaryContainer.delete())
                    .catch((err) => {
                        debug('Failed to delete temporary container', err);
                        //  Don't pass on this error - there is nothing we can do about it.
                    });
            });
        };

        return docker.container.create(params)
            .then((container) => {
                temporaryContainer = container;
                temporaryContainer.start();
            })
            .then(() => temporaryContainer.wait())
            .then(() => temporaryContainer.logs({
                follow: true,
                stdout: true,
                stderr: true
            }))
            .then(HigherDockerManager._processContainerOutputStream)
            .then((results) => {
                //  Schedule the cleanup and pass on the results.
                scheduleDelayedCleanup();
                return results;
            })
            .catch((err) => {
                debug('Failed to start or run temporary container', err);
                //  Schedule the cleanup and pass on the error.
                scheduleDelayedCleanup();
                return Promise.reject(err);
            });
    }

    /**
     * Runs container with the given parameters.
     * @param {Object} `params` Parameters for running a new container.
     * @return {Promise} Promise fulfilled once new container has been started.
     * @api public
     */
    static runContainer(params) {
        return docker.container.create(params)
            .then(container => container.start());
    }

    /**
     * Searches for the container with the given name or ID.
     * @param {string} `nameOrId` The name or ID of the container for which we are searching
     * @return {Promise} Promise returning the found container if any
     * @api public
     */
    static getContainerForNameOrId(nameOrId) {
        return docker.container
            .list({ all: true })
            .then(_.curry(HigherDockerManager.findContainerForNameOrId)(_, nameOrId));
    }

    /**
     * Finds the container with the given name or ID in the given containers collection.
     * @param {Array} `containers` Array of containers in which to try to find the container.
     * @param {string} `nameOrId` The name or ID of the container for which we are searching.
     * @return {Container} Found container if it was found, otherwise `null`.
     * @api public
     */
    static findContainerForNameOrId(containers, nameOrId) {
        //  Docker prefixes all container names with a single `/` even if the name
        //  was given with the same prefix (as it's returned by Docker)
        const prefixedContainerName = `/${_.trimStart(nameOrId, '/')}`;

        //  Find the container that matches with its ID or one of its names.
        return _.find(containers, container => container.id === nameOrId
                || _.some(container.Names, name => name === prefixedContainerName)
        ) || null;
    }

    /**
     * Finds the object with the given name or ID in the given collection. Note that this
     * function doesn't work for containers as they can have more than one name. Use
     * `findContainerForNameOrId` for containers.
     * @param {Array} `objects` Array of objects in which to try to find the object.
     * @param {string} `nameOrId` The name or ID of the object for which we are searching.
     * @return {Object} Found object if it was found, otherwise `null`.
     * @api public
     */
    static findObjectForNameOrId(objects, nameOrId) {
        //  Find the object that matches with its ID or one of its names.
        return _.find(objects, object => object.id === nameOrId || object.Name === nameOrId) ||
            null;
    }

    /**
     * Searches for all the containers with the given image name.
     * @param {string} `imageName` The name of the image including the tag for which we are searching
     * @return {Promise} Promise resolving with the array of matching containers.
     * @api public
     */
    static getContainersForImage(imageName) {
        return docker.container
            .list({ all: true })
            .then(_.curry(HigherDockerManager.filterContainersByImage)(_, imageName));
    }

    /**
     * Filters all containers with the given image name in the given collection of containers.
     * @param {Array} `containers` Array of containers which is being filtered.
     * @param {string} `imageName` The name of the image including the tag for which we are searching
     * @return {Array} Array of matching containers.
     * @api public
     */
    static filterContainersByImage(containers, imageName) {
        return _.filter(containers, ['Image', imageName]);
    }

    /**
     * Searches for all the containers with the given label name and value
     * @param {string} `labelName` The name of the label which we are searching
     * @param {string} `labelValue` The value of the lable which we are searching
     * @return {Promise} Promise resolving with the array of found containers.
     * @api public
     */
    static getContainersForLabel(labelName, labelValue) {
        return docker.container
            .list({ all: true })
            .then(_.curry(HigherDockerManager.filterObjectsByLabel)(_, labelName, labelValue));
    }

    /**
     * Filters all the objects with the given label name and value in the given collection of
     * objects.
     * @param {Array} `objects` Array of objects which is being filtered.
     * @param {string} `labelName` The name of the label which we are filtering.
     * @param {string} `labelValue` The value of the lable which we are filtering.
     * @return {Array} Array of matching objects.
     * @api public
     */
    static filterObjectsByLabel(objects, labelName, labelValue) {
        return _.filter(objects, object => _.some(object.Labels,
            (value, name) => name === labelName && value === labelValue));
    }

    /**
     * Executes a command in an already running container.
     * @param {Container} `container` Docker container object on which to execute the command
     * @param {Object} `params` Parameters of the execution
     * @return {Promise} Promise returning the output of the execution
     * @api public
     */
    static execInContainer(container, params) {
        return container.exec.create(_.assignIn(params, {
            AttachStdout: true,
            AttachStderr: true
        }))
            .then(exec => exec.start({
                Detach: false
            }))
            .then(HigherDockerManager._processContainerOutputStream);
    }
     /**
     * Changes docker configuration.
     * @param {Object} `conf` Docker API config object see node-docker-api for reference.
     * @api public
     */
    static setDocker(conf) {
        docker = new Docker(conf)
    }

    /**
     * Processes the output stream of a container.
     * @param {stream} `stream` Output stream of a container.
     * @return {Promise} Promise returning array of outputs
     * @private
     */
    static _processContainerOutputStream(stream) {
        return new Promise((resolve, reject) => {
            const buffers = [];
            stream.on('data', (buffer) => {
                buffers.push(buffer);
            });
            stream.on('end', () => {
                resolve(buffers);
            });
            stream.on('error', reject);
        })
            .then(HigherDockerManager._processContainerOutputBuffers);
    }

    /**
     * Converts container output buffers into a single string.
     * @param {Array} `buffers` Array of Node Buffers output from a Docker container.
     * @return {string} String joined out of output extracted from the given buffers.
     * @api public
     */
    static containerOutputBuffersToString(buffers) {
        return _
            .chain(HigherDockerManager._processContainerOutputBuffers(buffers))
            .map(output => output && output.payload)
            .filter()
            .value()
            .join('');
    }

    /**
     * Processes the array of output buffers from a container.
     * @param {Array} `buffers` Array of buffers with container output per Docker's format
     * @return {Array} Array of objects with type, size and payload of each container output
     * @private
     */
    static _processContainerOutputBuffers(buffers) {
        return _
            .chain(buffers)
            .map((buffer) => {
                // istanbul ignore if
                if (!Buffer.isBuffer(buffer) || buffer.length < PAYLOAD_HEADER_SIZE) {
                    debug('Bad container output', buffer);
                    return [];
                }

                //  Sometimes a single buffer contains more than one payload.
                const payloads = [];
                let currentIndex = 0;
                while (currentIndex < buffer.length) {
                    const type = buffer.readUInt8(
                        currentIndex + DOCKER_OUTPUT_HEADER_FRAME_TYPE_INDEX);
                    const size = buffer.readUInt32BE(
                        currentIndex + DOCKER_OUTPUT_HEADER_FRAME_SIZE_INDEX);
                    const payload = buffer.slice(currentIndex + DOCKER_OUTPUT_PAYLOAD_INDEX,
                        currentIndex + DOCKER_OUTPUT_PAYLOAD_INDEX + size);

                    payloads.push({
                        type,
                        size,
                        payload: payload.toString()
                    });

                    currentIndex += PAYLOAD_HEADER_SIZE + size;
                }

                // istanbul ignore if
                if (currentIndex !== buffer.length) {
                    debug('Docker buffer not entirely read', buffer);
                }

                return payloads;
            })
            .flatten()
            .filter()
            .value();
    }

    static _getNameTag(givenName, givenTag) {
        let name;
        let tag;
        //  If the name of the image includes ':' then it includes the tag and we should ignore
        //  the passed tag.
        if (_.includes(givenName, ':')) {
            [name, tag] = givenName.split(':');
        } else {
            name = givenName;
            tag = _.defaultTo(givenTag, 'latest');
        }

        return { name, tag };
    }
}

// Allow low-level access for hacking and easier development.
HigherDockerManager._docker = docker;

module.exports = HigherDockerManager;
