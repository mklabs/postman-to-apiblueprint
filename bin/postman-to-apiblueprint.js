#! /usr/bin/env node
process.env.DEBUG = process.env.DEBUG || 'postman-to-apiblueprint*';

const debug = require('debug')('postman-to-apiblueprint:cli');
const args = require('minimist')(process.argv.slice(2), {
  booleans: ['help', 'version'],
  strings: ['domain', 'bullet-list', 'bulletList']
});

const { run } = require('..');

run(args)
  .then(files => {
    if (!files || !files.length) return;
    for (const file of files) {
      debug('Blueprint for file %s', file.file);
      console.log(file.blueprint);
    }
  })
  .catch(err => {
    throw err;
  });

process.on('unhandledRejection', (reason, p) => {
  debug('Unhandled Rejection at:', p);
  throw new Error(reason);
});
