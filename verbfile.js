'use strict';

module.exports = function (verb) {
    verb.use(require('verb-generate-readme'));
    verb.task('default', ['readme']);
};
