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
| [read receipt][read-receipt-ref-url] | ✅ |
| [typing bubble][typing-bubble-ref-url] | ✅ |
| [text][text-ref-url] | ✅ |
| [quick_replies][quick-reply-ref-url] | ✅ |
| [button template][button-template-ref-url] | ✅ |
| [generic template][generic-template-ref-url] | ✅ |
| [receipt template][receipt-template-ref-url] | ✅ |

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
const {
  sendAs,
  // sendAsButtonTemplate,
  // sendAsGenericTemplate,
  // sendAsQuickReply,
  // sendAsReadReceipt,
  // sendAsReceiptTemplate,
  // sendAsText,
  // sendAsTypingBubble,
} = require('@messageflow/send-as');

/** Send as custom payload */
void async function demoSendAsCustomPayload() {
  try {
    const recipient = {
      /**
       * These IDs are page-scoped IDs (PSID).
       * This means that the IDs are unique for a given page.
       **/
      id: '<PSID>',
    };
    const message = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'media',
          elements: [
            {
              media_type: '<image|video>',
              url: '<FACEBOOK_URL>',
            },
          ],
        },
      },
    };
    const d = await sendAs(recipient, message);

    assert.deepEqual(d, {
      message_id: 'mid.$cAAJsujCd2ORj_1qmrFdzhVa-4cvO',
      recipient_id: '<PSID>',
    }); // OK
  } catch (e) {
    console.error('Failed to send as custom payload', e);
  }
}();
```

#### Native ES modules or TypeScript

```ts
import {
  sendAs,
  // sendAsButtonTemplate,
  // sendAsGenericTemplate,
  // sendAsQuickReply,
  // sendAsReadReceipt,
  // sendAsReceiptTemplate,
  // sendAsText,
  // sendAsTypingBubble,
} from '@messageflow/send-as';

/** Send as custom payload */
void async function demoSendAsCustomPayload() {
  try {
    const recipient = {
      /**
       * These IDs are page-scoped IDs (PSID).
       * This means that the IDs are unique for a given page.
       **/
      id: '<PSID>',
    };
    const message = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'media',
          elements: [
            {
              media_type: '<image|video>',
              url: '<FACEBOOK_URL>',
            },
          ],
        },
      },
    };
    const d = await sendAs(recipient, message);

    assert.deepEqual(d, {
      message_id: 'mid.$cAAJsujCd2ORj_1qmrFdzhVa-4cvO',
      recipient_id: '<PSID>',
    }); // OK
  } catch (e) {
    console.error('Failed to send as custom payload', e);
  }
}();
```

## API Reference

### Recipient
  
  - `id` <[string][string-mdn-url]> PSID of the message recipient.

### Response

  - `recipient_id` <[string][string-mdn-url]> Unique ID for the user which is usually the `PSID`.
  - `message_id` <[string][string-mdn-url]> Unique ID for the message.

### ErrorResponse

  - `error` <[Object][object-mdn-url]> Error object when a request fails.
    - `message` <[string][string-mdn-url]> Error message.
    - `type` <[string][string-mdn-url]> Error type.
    - `code` <[number][number-mdn-url]> Error code.
    - `fbtrace_id` <[string][string-mdn-url]> Unique ID for tracing the error request.

### sendAs(recipient, message)

  - `recipient` <[Recipient][recipient-ref-url]> Description of the message recipient.
  - `message` <[Object][object-mdn-url]> Message to be sent.
    - `text` <[string][string-mdn-url]> Message text. Must be UTF-8 and has a 2000 character limit. _`text` or `attachment` must be set._
    - `attachment` <[Object][object-mdn-url]> Used to send messages with media or structured messages. _`text` or `attachment` must be set._
    - `quick_replies` <[Object][object-mdn-url]> Optional array of `quick_reply` to be sent with messages.
    - `metadata` <[string][string-mdn-url]> Optional custom string that is delivered as a `message echo`. 1000 character limit.
  - returns: <[Promise][promise-mdn-url]<[Response][response-ref-url]>> Promise which resolves with a JSON object containing identifiers for the message and its recipient.

### sendAsReadReceipt(recipient, message)
### sendAsTypingBubble(recipient, message)
### sendAsText(recipient, message)
### sendAsQuickReply(recipient, message)
### sendAsButtonTemplate(recipient, message)
### sendAsGenericTemplate(recipient, message)
### sendAsReceiptTemplate(recipient, message)

## License

[MIT License](https://motss.mit-license.org/) © Rong Sen Ng



[typescript-url]: https://github.com/Microsoft/TypeScript
[node-js-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[node-releases-url]: https://nodejs.org/en/download/releases
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[fb-send-api-url]: https://developers.facebook.com/docs/messenger-platform/reference/send-api
[recipient-ref-url]: #recipient
[response-ref-url]: #response
[errorresponse-ref-url]: #errorresponse
[read-receipt-ref-url]: #sendasreadreceiptrecipientname
[typing-bubble-ref-url]: #sendastypingbubblerecipientname
[text-ref-url]: #sendastextrecipientname
[quick-reply-ref-url]: #sendasquickreplyrecipientname
[button-template-ref-url]: #sendasbuttontemplaterecipientname
[generic-template-ref-url]: #sendasgenerictemplaterecipientname
[receipt-template-ref-url]: #sendasreceipttemplaterecipientname


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
[inch-badge]: http://inch-ci.org/github/Messageflow/send-as.svg?branch=master&style=flat-square



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
