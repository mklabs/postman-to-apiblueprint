# postman-to-apiblueprint [![Build Status](https://travis-ci.org/mklabs/postman-to-apiblueprint.svg?branch=master)](https://travis-ci.org/mklabs/postman-to-apiblueprint)

A relatively simple tool to generate [API Blueprint](https://apiblueprint.org)
from a Postman collection.

The Postman collection dump has to conform to `v2.1`

## Install

```
npm install postman-to-apiblueprint -g
```

## Usage

```
postman-to-apiblueprint - Generate API Blueprint from postman collection dump

  --help        - Show this help output
  --version     - Show package version
  --domain      - Sets up a domain for blueprint generation
                (used to strip down content from request URLs)
  --bullet-list,
  --bulletList  - Use either +, - or * to specifity the list item character
                (though you choose any character there)
```

## Examples

See the [./examples](./examples) directory and the generated [blueprint](./examples/readme.md)

---

> MIT
