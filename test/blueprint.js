const postmanToApiBlueprint = require('..');
const drafter = require('drafter');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const read = promisify(fs.readFile);
const parse = promisify(drafter.parse);
const mock = require('./blueprint.json');

describe('postman-to-apiblueprint', () => {
  it('generated blueprint is parsable by drafter', async () => {
    const file = await read(
      path.join(__dirname, '../examples/readme.md'),
      'utf8'
    );
    const parsed = await parse(file);

    // fs.writeFileSync(path.join(__dirname, 'blueprint.json'), JSON.stringify(parsed, null, 2));
    assert.deepStrictEqual(parsed, mock);
  });

  it('API provided lets get content parsable by drafter', async () => {
    const json = path.join(
      __dirname,
      '../examples/quizz.example.postman_collection.v2.1.json'
    );
    const { blueprint } = await postmanToApiBlueprint.generate(json);

    const parsed = await parse(blueprint);
    assert.ok(parsed.content, 'Has a content item');
    assert.equal(parsed.element, 'parseResult', 'Has a valid element item');
  });
});
