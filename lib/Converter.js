const debug = require('debug')('postman-to-apiblueprint:converter');

/**
 * Class converter to transform a JSON content into an API Blueprint.
 *
 * @class
 */
class Converter {
  /**
   * Class constructor, taking a mandatory JSON content to transform.
   *
   * @param {String} json - JSON content representing the JSON to transform
   * @param {Object} options - Options
   */
  constructor(json, options = {}) {
    this.json = json;
    this.options = options;
    this.options.file = this.options.file || '';
    this.bl = this.options['bullet-list'] || this.options.bulletList || '+';

    this.name = '';
    this.description = '';
    this.domain = this.options.domain || '';
    this.fileFormat = 'FORMAT: 1A';
    this.requests = [];

    if (!this.json) {
      throw new Error('Converter is missing a JSON content to work with');
    }

    try {
      this.data = JSON.parse(json);
    } catch (err) {
      debug('Invalid JSON passed in ...');
      throw new Error(`Invalid JSON, verify provided JSON for ${options.file}`);
    }

    this.extractData();
  }

  /**
   * Extracts desired header information from JSON
   */
  extractData() {
    debug('Extracting data from JSON content ...');
    const { info } = this.data;

    if (!info) {
      throw new Error(
        'Unable to find "info" field, is it conform to v2.1 postman export ?'
      );
    }

    this.name = info.name;
    this.description = info.description || '';

    if (!this.name) {
      throw new Error('Provided JSON miss a "name" property');
    }
  }

  /**
   * Extract content type from request header
   *
   * @param {Object} request - The request/response object as saved by Postman
   */
  /* eslint-disable class-methods-use-this */
  extractContentType(obj) {
    const { header } = obj;
    if (!header) return 'application/json';
    const contentType = header.find(head => head.key === 'Content-Type');
    if (!contentType) return 'application/json';
    return contentType.value;
  }

  /**
   * Process requests in provided JSON, the "items" field.
   *
   * @returns The new array with requests information
   */
  processRequests() {
    debug('Processing requests ...');

    let buffer = [];
    const { item } = this.data;

    if (!item || !item.length) {
      throw new Error('JSON is missing requests ("item" field)');
    }

    for (const request of item) {
      const array = this.processRequest(request);
      buffer = buffer.concat(array);
    }

    return buffer;
  }

  /**
   * Process a single request and return a new array with blueprint information.
   *
   * @param {Object} item - The actual request item as saved by Postman
   */
  processRequest(item) {
    debug('Process request', item.name);

    const buffer = [];
    const { name, request, response } = item;
    if (!request) {
      throw new Error(
        `Invalid JSON: missing request field for item ${JSON.stringify(
          item,
          null,
          2
        )}`
      );
    }

    const { domain } = this;
    const method = request.method || 'GET';
    const requestURL = request.url;
    let url = requestURL.raw || '';
    url = url.replace(domain, '');

    buffer.push(`## ${name} [${url}]`);

    const description = request.description || '';

    buffer.push('');
    buffer.push(`### ${name} [${method}]`);
    buffer.push('');
    buffer.push(description);
    buffer.push('');

    this.writeRequest(request, buffer);
    if (response && response[0]) {
      this.writeResponse(response[0], buffer);
    }

    return buffer;
  }

  /**
   * Writes request buffer content for a specific request item.
   *
   * @param {Object} request - Actual request object as saved by Postman
   * @param {Array} buffer - The array buffer to write to
   */
  writeRequest(request, buffer) {
    const { bl } = this;
    const method = request.method || 'GET';
    const contentType = this.extractContentType(request);
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      buffer.push(`${bl} Request (${contentType})`);
      buffer.push('');

      const { body } = request;
      if (body && body.mode === 'raw') {
        const raw = JSON.parse(body.raw);
        buffer.push(
          JSON.stringify(raw, null, 4)
            .split(/\r?\n/g)
            .map(line => `        ${line}`)
            .join('\n')
        );
      }
    }
  }

  /**
   * Writes response buffer content for a specific request item.
   *
   * @param {Object} response - Actual response object as saved by Postman
   * @param {Array} buffer - The array buffer to write to
   */
  writeResponse(response, buffer) {
    const { bl } = this;
    const contentType = this.extractContentType(response);
    const { code, body } = response;
    buffer.push('');
    buffer.push(`${bl} Response ${code} (${contentType})`);
    buffer.push('');
    buffer.push(`    ${bl} Body`);
    buffer.push('');

    if (body) {
      const raw = JSON.parse(body);
      buffer.push(
        JSON.stringify(raw, null, 4)
          .split(/\r?\n/g)
          .map(line => `        ${line}`)
          .join('\n')
      );
      buffer.push('');
    }
  }

  generate() {
    debug('Generating content ...');
    let content = [];

    content.push(this.fileFormat);
    content.push('');
    content.push(`# ${this.name}`);
    content.push('');
    content.push(this.description);
    content.push('');
    content = content.concat(this.processRequests());

    return content.join('\n');
  }
}

module.exports = Converter;
