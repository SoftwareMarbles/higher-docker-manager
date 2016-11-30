
'use strict';

const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');

const HigherDockerManager = require('../lib/higher-docker-manager');

describe('HigherDockerManager', function() {
    describe('_processContainerOutputBuffers', function() {
        it('works correctly for buffers (1)', function() {
            const buffer = Buffer.from(JSON.parse(fs.readFileSync(
                __dirname + '/fixtures/docker-manager-buffers-1.json')));
            assert.equal(buffer.length, 611, buffer);
            const payloads = HigherDockerManager._processContainerOutputBuffers([buffer]);
            assert.equal(payloads.length, 2);
            const output = _
                .chain(payloads)
                .map((payload) => payload.payload.toString())
                .value()
                .join('');
            assert.equal(output.length, 595);
            assert.equal(output.split('\n').length, 11);
        });
    });

    describe('getContainerForNameOrId', function() {
        it('returns null on unknown container ID or name', function() {
            return HigherDockerManager.getContainerForNameOrId('xyz-inexistent')
                .then((container) => {
                    assert(_.isNull(container));
                });
        });

        it('returns container for good ID', function() {
            return HigherDockerManager.getOwnContainer()
                .then((container) => {
                    assert(container);
                    return HigherDockerManager.getContainerForNameOrId(container.Id);
                })
                .then((container) => {
                    assert(!_.isNull(container));
                });
        });

        it('returns container for good name', function() {
            return HigherDockerManager.getOwnContainer()
                .then((container) => {
                    assert(container);
                    return HigherDockerManager.getContainerForNameOrId(_.first(container.Names));
                })
                .then((container) => {
                    assert(!_.isNull(container));
                });
        });
    });

    describe('getContainersForImage', function() {
        it('returns empty on unknown image:tag', function() {
            return HigherDockerManager.getContainersForImage('xyz-inexistent:1.2.3')
                .then((containers) => {
                    assert(_.isEmpty(containers));
                });
        });

        it('returns container for good image:tag', function() {
            return HigherDockerManager.getOwnContainer()
                .then((container) => {
                    assert(container);
                    return HigherDockerManager.getContainersForImage('ierceg/node-dev:6.9.1');
                })
                .then((containers) => {
                    assert(!_.isEmpty(containers));
                });
        });
    });

    describe('getContainersForLabel', function() {
        it('returns empty on bad args', function() {
            return HigherDockerManager.getContainersForLabel()
                .then((containers) => {
                    assert(_.isEmpty(containers));
                });
        });

        it('returns empty on unknown label', function() {
            return HigherDockerManager.getContainersForLabel('xyz-inexistent', '')
                .then((containers) => {
                    assert(_.isEmpty(containers));
                });
        });

        it('returns empty on test label but inexistent value', function() {
            return HigherDockerManager.getContainersForLabel('test-label', 'xyz-inexistent')
                .then((containers) => {
                    assert(_.isEmpty(containers));
                });
        });

        it('returns container for good image:tag', function() {
            return HigherDockerManager.getContainersForLabel('test-label', 'test-value')
                .then((containers) => {
                    assert(!_.isEmpty(containers));
                });
        });
    });

    describe('getContainersForNetwork', function() {
        it('returns empty on empty network names', function() {
            return HigherDockerManager.getContainersInNetworks([])
                .then((containers) => {
                    assert(_.isEmpty(containers));
                });
        });

        it('returns empty on unknown network names', function() {
            return HigherDockerManager.getContainersInNetworks(['xyz-inexistent-network'])
                .then((containers) => {
                    assert(_.isEmpty(containers));
                });
        });

        it('returns container for same network as this container', function() {
            return HigherDockerManager.getOwnContainer()
                    .then((container) => {
                    assert(container);
                    return HigherDockerManager.getContainersInNetworks(
                        container.NetworkSettings.Networks);
                })
                .then((containers) => {
                    assert(!_.isEmpty(containers));
                });
        });
    });
});
