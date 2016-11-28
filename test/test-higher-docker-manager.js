
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
});
