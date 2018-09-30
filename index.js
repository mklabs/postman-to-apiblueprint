const debug = require('debug')('postman-to-apiblueprint');
const { promisify } = require('util');
const fs = require('fs');
const pkg = require('./package.json');
const Converter = require('./lib/Converter');

const read = promisify(fs.readFile);

/**
 * Generate API Blueprint from provided JSON file.
 *
 * @param {String} json - Path to JSON file to parse and generate from.
 * @param {Object} opts - Minimist options.
 */
const generate = async (file, opts) => {
  debug('Generate API blueprint from %s file', file);
  const json = await read(file, 'utf8');
  const converter = new Converter(json, {
    ...opts,
    file
  });

  return {
    file,
    // json,
    blueprint: converter.generate()
  };
};

/**
 * Binary run entry point.
 *
 * @param {Object} opts - Options for the run, as parsed by minimist
 */
const run = opts => {
  /* eslint-disable consistent-return, no-console */
  if (opts.help) {
    return Promise.resolve(
      console.log(`${pkg.name} - ${pkg.description}

  --help        - Show this help output
  --version     - Show package version
  --domain      - Sets up a domain for blueprint generation
                (used to strip down content from request URLs)
  --bullet-list,
  --bulletList  - Use either +, - or * to specifity the list item character
                (though you choose any character there)
      `)
    );
  }

  if (opts.version) {
    return Promise.resolve(console.log(pkg.version));
  }

  const files = opts._;
  return Promise.all(files.map(file => generate(file, opts)));
};

module.exports = {
  run,
  generate
};
