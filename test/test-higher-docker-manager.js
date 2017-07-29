
'use strict';

/* global describe, it, before, after */
/* eslint func-names: off, prefer-arrow-callback: off */

const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const streamBuffers = require('stream-buffers');
const nockBack = require('nock').back;
const td = require('testdouble');
const os = require('os');

nockBack.fixtures = 'test/fixtures';

const HigherDockerManager = require('../lib/higher-docker-manager');

describe('HigherDockerManager', function () {
    before(() => {
        //  HACK: Fix recorded text fixtures setting Config.Hostname to 'test-hostname'
        //  otherwise `getOwnContainer()` will not work correctly after recording.
        //  Simply replace all occurrences of `"Hostname": "<record hostname>"` with
        //  `"Hostname": "test-hostname"`
        td.replace(os, 'hostname');
        td.when(os.hostname()).thenReturn('test-hostname');
    });

    after(() => {
        td.reset();
    });

    describe('pullImage', function () {
        it('issues an error on unknown image', function () {
            this.timeout(20000);
            return nockBack('test-pull-image-1.json').then(({ nockDone }) =>
                HigherDockerManager.pullImage({}, 'xyz-inexistent', '1.2.3')
                    .then(() => {
                        assert(false);
                        process.exit(-1);
                    })
                    .catch((err) => {
                        assert(err);
                        assert.equal(err.message.trim(), '(HTTP code 404) unexpected - {"message":' +
                            '"repository xyz-inexistent not found: does not exist or no pull access"}');
                    })
                    .then(nockDone)
            );
        });

        it('returns image object on success', function () {
            this.timeout(100000);
            return nockBack('test-pull-image-2.json').then(({ nockDone }) =>
                HigherDockerManager.pullImage({}, 'hello-world', 'latest')
                    .then((image) => {
                        assert(image);
                        assert.equal(image.id, 'hello-world:latest');
                    })
                    .catch((err) => {
                        assert(false, err);
                        process.exit(-1);
                    })
                    .then(nockDone)
            );
        });

        it('returns image object on success with name and tag in name', function () {
            this.timeout(100000);
            return nockBack('test-pull-image-3.json').then(({ nockDone }) =>
                HigherDockerManager.pullImage({}, 'hello-world:latest')
                    .then((image) => {
                        assert(image);
                        assert.equal(image.id, 'hello-world:latest');
                    })
                    .catch((err) => {
                        assert(false, err);
                        process.exit(-1);
                    })
                    .then(nockDone)
            );
        });

        it('returns image object on success with name and tag in name (2)', function () {
            this.timeout(100000);
            return nockBack('test-pull-image-4.json').then(({ nockDone }) =>
                HigherDockerManager.pullImage({}, 'hello-world')
                    .then((image) => {
                        assert(image);
                        assert.equal(image.id, 'hello-world:latest');
                    })
                    .catch((err) => {
                        assert(false, err);
                        process.exit(-1);
                    })
                    .then(nockDone)
            );
        });

        it('returns image object on success with name and tag in name (3)', function () {
            this.timeout(100000);
            return nockBack('test-pull-image-5.json').then(({ nockDone }) =>
                HigherDockerManager.pullImage({}, 'hello-world', 'latest')
                    .then((image) => {
                        assert(image);
                        assert.equal(image.id, 'hello-world:latest');
                    })
                    .catch((err) => {
                        assert(false, err);
                        process.exit(-1);
                    })
                    .then(nockDone)
            );
        });
    });

    describe('runTemporaryContainer', function () {
        this.timeout(100000);
        it('works', function () {
            return nockBack('test-run-temporary-container-1.json').then(({ nockDone }) =>
                HigherDockerManager.pullImage({}, 'hello-world:latest')
                    .then(() => HigherDockerManager.runTemporaryContainer({
                        image: 'hello-world:latest'
                    }))
                    .then((output) => {
                        assert(_.isArray(output));
                        assert(output[1].payload, 'Hello from Docker!\n');
                    })
                    .then(nockDone)
            );
        });
    });

    describe('_processContainerOutputStream', function () {
        it('works correctly for buffers (1)', function () {
            const buffer = Buffer.from(JSON.parse(fs.readFileSync(
                `${__dirname}/fixtures/docker-manager-buffers-1.json`)));
            assert.equal(buffer.length, 611, buffer);
            const stream = new streamBuffers.ReadableStreamBuffer({
                frequency: 1,
                //  Container outputs its buffers in a certain way and we expect that
                //  so we cannot cut them further during testing.
                chunkSize: buffer.length
            });
            stream.put(buffer);
            stream.stop();
            return HigherDockerManager._processContainerOutputStream(stream)
                .then((payloads) => {
                    assert.equal(payloads.length, 2);
                    const output = _(payloads)
                        .map(payload => payload.payload.toString())
                        .join('');
                    assert.equal(output.length, 595);
                    assert.equal(output.split('\n').length, 11);
                });
        });
    });

    describe('_processContainerOutputBuffers', function () {
        it('works correctly for buffers (1)', function () {
            const buffer = Buffer.from(JSON.parse(fs.readFileSync(
                `${__dirname}/fixtures/docker-manager-buffers-1.json`)));
            assert.equal(buffer.length, 611, buffer);
            const payloads = HigherDockerManager._processContainerOutputBuffers([buffer]);
            assert.equal(payloads.length, 2);
            const output = _(payloads)
                .map(payload => payload.payload.toString())
                .join('');
            assert.equal(output.length, 595);
            assert.equal(output.split('\n').length, 11);
        });
    });

    describe('containerOutputBuffersToString', function () {
        it('works correctly for buffers (1)', function () {
            const buffer = Buffer.from(JSON.parse(fs.readFileSync(
                `${__dirname}/fixtures/docker-manager-buffers-1.json`)));
            assert.equal(buffer.length, 611, buffer);
            const output = HigherDockerManager.containerOutputBuffersToString([buffer]);
            assert.equal(output.length, 595);
            assert.equal(output.split('\n').length, 11);
        });
    });

    describe('getContainerForNameOrId', function () {
        it('returns null on unknown container ID or name', function () {
            return nockBack('test-get-container-for-name-or-id-1.json').then(({ nockDone }) =>
                HigherDockerManager.getContainerForNameOrId('xyz-inexistent')
                    .then((container) => {
                        assert(_.isNull(container));
                    })
                    .then(nockDone)
            );
        });

        it('returns container for good ID', function () {
            return nockBack('test-get-container-for-name-or-id-2.json').then(({ nockDone }) =>
                HigherDockerManager.getOwnContainer()
                    .then((container) => {
                        assert(container);
                        return HigherDockerManager.getContainerForNameOrId(container.Id);
                    })
                    .then((container) => {
                        assert(!_.isNull(container));
                    })
                    .then(nockDone)
            );
        });

        it('returns container for good name', function () {
            return nockBack('test-get-container-for-name-or-id-3.json').then(({ nockDone }) =>
                HigherDockerManager.getOwnContainer()
                    .then((container) => {
                        assert(container);
                        return HigherDockerManager.getContainerForNameOrId(_.head(container.Names));
                    })
                    .then((container) => {
                        assert(!_.isNull(container));
                    })
                    .then(nockDone)
            );
        });
    });

    describe('getContainersForImage', function () {
        it('returns empty on unknown image:tag', function () {
            return nockBack('test-get-container-for-image-1.json').then(({ nockDone }) =>
                HigherDockerManager.getContainersForImage('xyz-inexistent:1.2.3')
                    .then((containers) => {
                        assert(_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });

        it('returns container for good label:name', function () {
            return nockBack('test-get-container-for-image-2.json').then(({ nockDone }) =>
                HigherDockerManager.getOwnContainer()
                    .then((container) => {
                        assert(container);
                        return HigherDockerManager.getContainersForImage('ierceg/node-dev:6.9.1');
                    })
                    .then((containers) => {
                        assert(!_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });
    });

    describe('getVolumesForLabel', function () {
        it('returns empty on bad args', function () {
            return nockBack('test-get-volumes-for-label-1.json').then(({ nockDone }) =>
                HigherDockerManager.getVolumesForLabel()
                    .then((containers) => {
                        assert(_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });

        it('returns empty on unknown label', function () {
            return nockBack('test-get-volumes-for-label-2.json').then(({ nockDone }) =>
                HigherDockerManager.getVolumesForLabel('xyz-inexistent', '')
                    .then((containers) => {
                        assert(_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });

        it('returns empty on test label but inexistent value', function () {
            return nockBack('test-get-volumes-for-label-3.json').then(({ nockDone }) =>
                HigherDockerManager.getVolumesForLabel('test-label', 'xyz-inexistent')
                    .then((containers) => {
                        assert(_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });
    });

    describe('getNetworksForLabel', function () {
        it('returns empty on bad args', function () {
            return nockBack('test-get-networks-for-label-1.json').then(({ nockDone }) =>
                HigherDockerManager.getNetworksForLabel()
                    .then((containers) => {
                        assert(_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });

        it('returns empty on unknown label', function () {
            return nockBack('test-get-networks-for-label-2.json').then(({ nockDone }) =>
                HigherDockerManager.getNetworksForLabel('xyz-inexistent', '')
                    .then((containers) => {
                        assert(_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });

        it('returns empty on test label but inexistent value', function () {
            return nockBack('test-get-networks-for-label-3.json').then(({ nockDone }) =>
                HigherDockerManager.getNetworksForLabel('test-label', 'xyz-inexistent')
                    .then((containers) => {
                        assert(_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });
    });

    describe('getContainersForNetwork', function () {
        it('returns empty on empty network names', function () {
            return nockBack('test-get-containers-for-networks-1.json').then(({ nockDone }) =>
                HigherDockerManager.getContainersInNetworks([])
                    .then((containers) => {
                        assert(_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });

        it('returns empty on unknown network names', function () {
            return nockBack('test-get-containers-for-networks-2.json').then(({ nockDone }) =>
                HigherDockerManager.getContainersInNetworks(['xyz-inexistent-network'])
                    .then((containers) => {
                        assert(_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });

        it('returns container for same network as this container', function () {
            return nockBack('test-get-containers-for-networks-3.json').then(({ nockDone }) =>
                HigherDockerManager.getOwnContainer()
                    .then((container) => {
                        assert(container);
                        return HigherDockerManager.getContainersInNetworks(
                            container.NetworkSettings.Networks);
                    })
                    .then((containers) => {
                        assert(!_.isEmpty(containers));
                    })
                    .then(nockDone)
            );
        });
    });

    describe('getNetworkForNameOrId', function () {
        it('returns null on unknown ID or name', function () {
            return nockBack('test-get-network-for-name-or-id-1.json').then(({ nockDone }) =>
                HigherDockerManager.getNetworkForNameOrId('xyz-inexistent')
                    .then((container) => {
                        assert(_.isNull(container));
                    })
                    .then(nockDone)
            );
        });

        it('returns object for good name', function () {
            return nockBack('test-get-network-for-name-or-id-2.json').then(({ nockDone }) =>
                HigherDockerManager.getOwnContainer()
                    .then((container) => {
                        assert(container);
                        return HigherDockerManager.getNetworkForNameOrId(_.head(_.keys(
                            container.NetworkSettings.Networks)));
                    })
                    .then((network) => {
                        assert(!_.isNull(network));
                    })
                    .then(nockDone)
            );
        });
    });
});
