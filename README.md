<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">@messageflow/send-as</h1>

  <p>Utility library for Facebook Messenger's Send API in Node.js</p>
</div>

<hr />

[![NPM][nodei-badge]][nodei-url]

[![Build Status][travis-badge]][travis-url]
[![Version][version-badge]][version-url]
[![Downloads][downloads-badge]][downloads-url]
[![MIT License][mit-license-badge]][mit-license-url]
[![Dependency Status][daviddm-badge]][daviddm-url]
[![NSP Status][nsp-badge]][nsp-url]

[![Code of Conduct][coc-badge]][coc-url]
[![Codecov][codecov-badge]][codecov-url]
[![Coverage Status][coveralls-badge]][coveralls-url]

[![codebeat-badge]][codebeat-url]
[![codacy-badge]][codacy-url]
[![inch-badge]][inch-url]

> Facebook Messenger [Send API][fb-send-api-url] is the main API used to send messages to users. Besides sending plain text messages, the API allows one to send:-

1. Quick replies
2. Rich media messages (`images`, `audios`, `videos`, or `files`)
3. Templates (`generic template`, `button template`, `receipt template`, `list template`)

This simple utility library makes sending all these types of messages easier but **ONLY** a few of them are supported with utility method as of now due to usage. However, one can always use the base method to send any message type as custom payload.

| Message Type | Utility method |
| --- | :---: |
| text | ✅ |
| quick_replies | ✅ |
| read receipt | ✅ |
| typing bubble | ✅ |
| generic template | ✅ |
| button template | ✅ |
| receipt template | ✅ |

## Table of contents

## Pre-requisites

- [Node.js][node-js-url] >= 8.9.0
- [NPM][npm-url] >= 5.5.1 ([NPM][npm-url] comes with [Node.js][node-js-url] so there is no need to install separately.)

## Setup

### Install

```sh
# Install via NPM
$ npm install --save @messageflow/send-as
```

### Usage

#### Node.js

```js
const greeting = require('@messageflow/send-as');
```

#### Native ES modules or TypeScript

```ts
import greeting from '@messageflow/send-as';
```

## API Reference

### greeting(name)

  - name <[string][string-mdn-url]> Name of the person to greet at.
  - returns: <[Promise][promise-mdn-url]<[string][string-mdn-url]>> Promise which resolves with a greeting message.

## License

[MIT License](https://motss.mit-license.org/) © Rong Sen Ng



[typescript-url]: https://github.com/Microsoft/TypeScript
[node-js-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[node-releases-url]: https://nodejs.org/en/download/releases
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[fb-send-api-url]: https://developers.facebook.com/docs/messenger-platform/reference/send-api



[nodei-badge]: https://nodei.co/npm/@messageflow/send-as.png?downloads=true&downloadRank=true&stars=true

[travis-badge]: https://img.shields.io/travis/Messageflow/send-as.svg?style=flat-square

[version-badge]: https://img.shields.io/npm/v/@messageflow/send-as.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/@messageflow/send-as.svg?style=flat-square
[mit-license-badge]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[nsp-badge]: https://nodesecurity.io/orgs/messageflow/projects/450aa942-cae3-448f-a637-c380767c68f3/badge
[daviddm-badge]: https://img.shields.io/david/messageflow/send-as.svg?style=flat-square

[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[codecov-badge]: https://codecov.io/gh/Messageflow/send-as/branch/master/graph/badge.svg?style=flat-square
[coveralls-badge]: https://coveralls.io/repos/github/Messageflow/send-as/badge.svg?branch=master&style=flat-square

[codebeat-badge]: https://codebeat.co/badges/cb737f7f-0fc7-4d80-afdc-41b0baf53f42?style=flat-square
[codacy-badge]: https://api.codacy.com/project/badge/Grade/dea8f78a242b4fe092c28223b960c951?style=flat-square
[inch-badge]: http://inch-ci.org/github/Messageflow/send-as.svg?branch=master?style=flat-square



[nodei-url]: https://nodei.co/npm/@messageflow/send-as

[travis-url]: https://travis-ci.org/Messageflow/send-as
[version-url]: https://npmjs.org/package/@messageflow/send-as
[downloads-url]: http://www.npmtrends.com/@messageflow/send-as
[mit-license-url]: https://github.com/Messageflow/send-as/blob/master/LICENSE
[nsp-url]: https://nodesecurity.io/orgs/messageflow/projects/450aa942-cae3-448f-a637-c380767c68f3
[daviddm-url]: https://david-dm.org/Messageflow/send-as

[coc-url]: https://github.com/Messageflow/send-as/blob/master/CODE_OF_CONDUCT.md
[codecov-url]: https://codecov.io/gh/Messageflow/send-as
[coveralls-url]: https://coveralls.io/github/Messageflow/send-as?branch=master

[codebeat-url]: https://codebeat.co/projects/github-com-messageflow-send-as-master
[codacy-url]: https://www.codacy.com/app/motss/send-as?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Messageflow/send-as&amp;utm_campaign=Badge_Grade
[inch-url]: http://inch-ci.org/github/Messageflow/send-as
