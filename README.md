<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">@messageflow/send-as</h1>

  <p>Utility library for Facebook Messenger's Send API in Node.js</p>
</div>

<hr />

[![Version][version-badge]][version-url]
[![Node version][node-version-badge]][node-version-url]
[![MIT License][mit-license-badge]][mit-license-url]

[![Downloads][downloads-badge]][downloads-url]
[![Total downloads][total-downloads-badge]][downloads-url]
[![Packagephobia][packagephobia-badge]][packagephobia-url]
[![Bundlephobia][bundlephobia-badge]][bundlephobia-url]

[![Build Status][travis-badge]][travis-url]
[![CircleCI][circleci-badge]][circleci-url]
[![Dependency Status][daviddm-badge]][daviddm-url]
[![codecov][codecov-badge]][codecov-url]
[![Coverage Status][coveralls-badge]][coveralls-url]

[![codebeat badge][codebeat-badge]][codebeat-url]
[![Codacy Badge][codacy-badge]][codacy-url]
[![Code of Conduct][coc-badge]][coc-url]

> Facebook Messenger [Send API][fb-send-api-url] is the main API used to send messages to users. Besides sending plain text messages, the API allows one to send:-

1. Quick replies
2. Rich media messages (`images`, `audios`, `videos`, or `files`)
3. Templates (`generic template`, `button template`, `receipt template`, `list template`)

This simple utility library makes sending all these types of messages easier but **ONLY** a few of them are supported with utility method as of now due to usage. However, one can always use the base method to send any message type as custom payload.

| Message Type | Utility method |
| --- | :---: |
| [custom payload][custom-payload-ref-url] | ✅ |
| [read receipt][read-receipt-ref-url] | ✅ |
| [typing bubble][typing-bubble-ref-url] | ✅ |
| [text][text-ref-url] | ✅ |
| [quick_replies][quick-reply-ref-url] | ✅ |
| [button template][button-template-ref-url] | ✅ |
| [generic template][generic-template-ref-url] | ✅ |
| [receipt template][receipt-template-ref-url] | ✅ |

## Table of contents

- [Pre-requisites](#pre-requisites)
- [Setup](#setup)
  - [Install](#install)
  - [Usage](#usage)
    - [Node.js](#nodejs)
    - [Native ES modules or TypeScript](#native-es-modules-or-typescript)
- [API Reference](#api-reference)
  - [Recipient](#recipient)
  - [SendAsParams](#sendasparams)
  - [SendAsReadReceiptParams](#sendasreadreceiptparams)
  - [SendAsTypingBubbleParams](#sendastypingbubbleparams)
  - [SendAsTextParams](#sendastextparams)
  - [SendAsQuickReplyParams](#sendasquickreplyparams)
  - [SendAsButtonTemplateParams](#sendasbuttontemplateparams)
  - [SendAsGenericTemplateParams](#sendasgenerictemplateparams)
  - [SendAsReceiptTemplateParams](#sendasreceipttemplateparams)
  - [Response](#response)
  - [ErrorResponse](#errorresponse)
  - [sendAs(params)](#sendasparams)
  - [sendAsReadReceipt(params)](#sendasreadreceiptparams)
  - [sendAsTypingBubble(params)](#sendastypingbubbleparams)
  - [sendAsText(params)](#sendastextparams)
  - [sendAsQuickReply(params)](#sendasquickreplyparams)
  - [sendAsButtonTemplate(params)](#sendasbuttontemplateparams)
  - [sendAsGenericTemplate(params)](#sendasgenerictemplateparams)
  - [sendAsReceiptTemplate(params)](#sendasreceipttemplateparams)
- [License](#license)

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
    const d = await sendAs({
      message,
      recipient,
      url: '<FACEBOOK_GRAPH_URL>/me/messages?access_token=<FACEBOOK_PAGE_ACCESS_TOKEN>',
    });

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
    const d = await sendAs({
      message,
      recipient,
      url: '<FACEBOOK_GRAPH_URL>/me/messages?access_token=<FACEBOOK_PAGE_ACCESS_TOKEN>',
    });

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

### SendAsParams

- `url` <[string][string-mdn-url]> URL to send message to.
- `recipient` <[Recipient][recipient-ref-url]> Description of the message recipient.
- `message` <[Object][object-mdn-url]> Description of the message to be sent.
  - `text` <[string][string-mdn-url]> Message text. Must be UTF-8 and has a 2000 character limit. _`text` or `attachment` must be set._
  - `attachment` <[Object][object-mdn-url]> Used to send messages with media or structured messages. _`text` or `attachment` must be set._
  - `quick_replies` <[Object][object-mdn-url]> Optional array of `quick_reply` to be sent with messages.
  - `metadata` <[string][string-mdn-url]> Optional custom string that is delivered as a `message echo`. 1000 character limit.
- `notificationType` <[string][string-mdn-url]> Optional push notification type.
  - `REGULAR`: sound/ vibration.
  - `SILENT_PUSH`: on-screen notification only.
  - `NO_PUSH`: no notification.
- `typingDelay` <[number][number-mdn-url]> Optional typing delay in milliseconds. Defaults to `500`.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.

### SendAsReadReceiptParams

- `url` <[string][string-mdn-url]> URL to send message to.
- `recipient` <[Recipient][recipient-ref-url]> Description of the message recipient.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.

### SendAsTypingBubbleParams

- `url` <[string][string-mdn-url]> URL to send message to.
- `recipient` <[Recipient][recipient-ref-url]> Description of the message recipient.
- `showTyping` <[boolean][boolean-mdn-url]> If true, display typing bubble. Defaults to `true`.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.

### SendAsTextParams

- `url` <[string][string-mdn-url]> URL to send message to.
- `recipient` <[Recipient][recipient-ref-url]> Description of the message recipient.
- `message` <[Object][object-mdn-url]> Description of the message to be sent.
  - `text` <[string][string-mdn-url]> Message text. Must be UTF-8 and has a 2000 character limit.
- `notificationType` <[string][string-mdn-url]> Optional push notification type.
  - `REGULAR`: sound/ vibration.
  - `SILENT_PUSH`: on-screen notification only.
  - `NO_PUSH`: no notification.
- `typingDelay` <[number][number-mdn-url]> Optional typing delay in milliseconds. Defaults to `500`.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.

### SendAsQuickReplyParams

- `url` <[string][string-mdn-url]> URL to send message to.
- `recipient` <[Recipient][recipient-ref-url]> Description of the message recipient.
- `message` <[Object][object-mdn-url]> Description of the message to be sent.
  - `text` <[string][string-mdn-url]> Non-empty message text to send with the quick replies. `text` or `attachment` must be set. 2000 character limit.
  - `attachment` <[Object][object-mdn-url]> Optional attachment to send with the quick replies. `text` or `attachment` must be set.
  - `quick_replies` <[Array][array-mdn-url]&lt;[quick_reply][send-api-quick-reply-url]&gt;> An array of objects the describe the quick reply [buttons][send-messages-buttons-url] to send. A maximum of 11 quick replies are supported.
- `notificationType` <[string][string-mdn-url]> Optional push notification type.
  - `REGULAR`: sound/ vibration.
  - `SILENT_PUSH`: on-screen notification only.
  - `NO_PUSH`: no notification.
- `typingDelay` <[number][number-mdn-url]> Optional typing delay in milliseconds. Defaults to `500`.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.

### SendAsButtonTemplateParams

- `url` <[string][string-mdn-url]> URL to send message to.
- `recipient` <[Recipient][recipient-ref-url]> Description of the message recipient.
- `message` <[Object][object-mdn-url]> Description of the message to be sent.
  - `attachment` <[Object][object-mdn-url]> An object describing attachments to the message.
    - `type` <[string][string-mdn-url]> Value must be `template`.
    - `payload` <[Object][object-mdn-url]> Payload of the template.
      - `template_type` <[string][string-mdn-url]> Value must be `button`.
      - `text` <[string][string-mdn-url]> Must be UTF-8 encoded text. 640 character limit.
      - `buttons` <[Array][array-mdn-url]&lt;[button][send-messages-buttons-url]&gt;> An array of 1 - 3 buttons that appear as call-to-actions.
- `notificationType` <[string][string-mdn-url]> Optional push notification type.
  - `REGULAR`: sound/ vibration.
  - `SILENT_PUSH`: on-screen notification only.
  - `NO_PUSH`: no notification.
- `typingDelay` <[number][number-mdn-url]> Optional typing delay in milliseconds. Defaults to `500`.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.

### SendAsGenericTemplateParams

- `url` <[string][string-mdn-url]> URL to send message to.
- `recipient` <[Recipient][recipient-ref-url]> Description of the message recipient.
- `message` <[Object][object-mdn-url]> Description of the message to be sent.
  - `attachment` <[Object][object-mdn-url]> An object describing attachments to the message.
    - `type` <[string][string-mdn-url]> Value must be `template`.
    - `payload` <[Object][object-mdn-url]> Payload of the template.
      - `template_type` <[string][string-mdn-url]> Value must be `generic`.
      - `elements` <[Array][array-mdn-url]&lt;[Object][object-mdn-url]&gt;> An array of element objects that describe instances of the generic template to be sent. A horizontally scrollable carousel forms when more than 1 element in a template. 10 elements limit.
        - `title` <[string][string-mdn-url]> Title of the template. 80 character limit.
        - `subtitle` <[string][string-mdn-url]> Optional subtitle of the template. 80 character limit.
        - `image_url` <[string][string-mdn-url]> Optional image URL of the template.
        - `default_action` <[Object][object-mdn-url]> Optional default action executed when the template is tapped. Has the same properties as [URL button][send-api-url-button-url], except the `title`.
        - `buttons` <[Array][array-mdn-url]&lt;[button][send-messages-buttons-url]&gt;> Optional array of buttons to append to the template. 3 buttons limit for each element.
      - `sharable` <[boolean][boolean-mdn-url]> Optional native share button in Messenger for the the template message. Defaults to `false`.
      - `image_aspect_ratio` <[string][string-mdn-url]> Optional aspect ratio used to render images specified by `element.image_url`. Must be `horizontal` (1.91:1) or `square` (1:1). Defaults to `horizontal`.
- `notificationType` <[string][string-mdn-url]> Optional push notification type.
  - `REGULAR`: sound/ vibration.
  - `SILENT_PUSH`: on-screen notification only.
  - `NO_PUSH`: no notification.
- `typingDelay` <[number][number-mdn-url]> Optional typing delay in milliseconds. Defaults to `500`.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.

### SendAsReceiptTemplateParams

- `url` <[string][string-mdn-url]> URL to send message to.
- `recipient` <[Recipient][recipient-ref-url]> Description of the message recipient.
- `message` <[Object][object-mdn-url]> Description of the message to be sent.
  - `attachment` <[Object][object-mdn-url]> An object describing attachments to the message.
    - `type` <[string][string-mdn-url]> Value must be `template`.
    - `payload` <[Object][object-mdn-url]> Payload of the template.
      - `template_type` <[string][string-mdn-url]> Value must be `receipt`.
      - `recipient_name` <[string][string-mdn-url]> The recipient's name.
      - `order_number` <[string][string-mdn-url]> Unique order number.
      - `currency` <[string][string-mdn-url]> Currency of the payment.
      - `payment_method` <[string][string-mdn-url]> Custom string about which payment method and account a customer used, e.g. _Visa 1234_
      - `summary` <[Object][object-mdn-url]> Payment summary.
        - `total_cost` <[number][number-mdn-url]> Total cost of the order, including sub-total, shipping, and tax.
        - `subtotal` <[number][number-mdn-url]> Optional sub-total of the order.
        - `shipping_cost` <[number][number-mdn-url]> Optional shipping cost of the order.
        - `total_tax` <[number][number-mdn-url]> Optional tax of the order.
      - `sharable` <[boolean][boolean-mdn-url]> Optional native share button in Messenger for the the template message. Defaults to `false`.
      - `merchant_name` <[string][string-mdn-url]> Optional merchant's name. It is shown as logo text if this presents.
      - `timestamp` <[number][number-mdn-url]> Optional timestamp of the order in seconds.
      - `elements` <[Object][object-mdn-url]> Optional array of elements of the order. 100 elements limit. Order of the elements is not guaranteed.
        - `title` <[string][string-mdn-url]> Name of the item.
        - `price` <[number][number-mdn-url]> Price of the item. It is a free item when the value is `0`.
        - `subtitle` <[string][string-mdn-url]> Optional description of the item.
        - `quantity` <[number][number-mdn-url]> Optional quantity of the item.
        - `currency` <[string][string-mdn-url]> Optional currency of the item price.
        - `image_url` <[string][string-mdn-url]> Optional image URL of the item.
      - `address` <[Object][object-mdn-url]> Optional shipping address of the order.
        - `street_1` <[string][string-mdn-url]> Street address, line 1.
        - `city` <[string][string-mdn-url]> City name of the address.
        - `postal_code` <[string][string-mdn-url]> Postal code of the address.
        - `state` <[string][string-mdn-url]> State abbreviation for U.S. addresses, or the region/ province for non U.S. addresses.
        - `country` <[string][string-mdn-url]> 2-letter country code of the address.
        - `street_2` <[string][string-mdn-url]> Optional street address, line 2.
      - `adjustments` <[Object][object-mdn-url]> Optional array of payment adjustments, such as discounts.
        - `name` <[string][string-mdn-url]> Name of the adjustment.
        - `amount` <[number][number-mdn-url]> Amount of the adjustment.
- `notificationType` <[string][string-mdn-url]> Optional push notification type.
  - `REGULAR`: sound/ vibration.
  - `SILENT_PUSH`: on-screen notification only.
  - `NO_PUSH`: no notification.
- `typingDelay` <[number][number-mdn-url]> Optional typing delay in milliseconds. Defaults to `500`.
- `options` <[Object][object-mdn-url]> Optional request options. See [node-fetch options][node-fetch-options-url] for more details.

### Response

- `recipient_id` <[string][string-mdn-url]> Unique ID for the user which is usually the `PSID`.
- `message_id` <[string][string-mdn-url]> Unique ID for the message.

### ErrorResponse

- `error` <[Object][object-mdn-url]> Error object when a request fails.
  - `message` <[string][string-mdn-url]> Error message.
  - `type` <[string][string-mdn-url]> Error type.
  - `code` <[number][number-mdn-url]> Error code.
  - `fbtrace_id` <[string][string-mdn-url]> Unique ID for tracing the error request.

___

### sendAs(params)

- `params` <[SendAsParams][sendasparams-ref-url]> Parameters required to call the method.
- returns: <[Promise][promise-mdn-url]<[Response][response-ref-url]>> Promise which resolves with a JSON object containing identifiers for the message and its recipient.

The method throws an [ErrorResponse][errorresponse-ref-url] when the request is not a successful.

### sendAsReadReceipt(params)

- `params` <[SendAsReadReceiptParams][sendasreadreceiptparams-ref-url]> Parameters required to call the method.
- returns: <[Promise][promise-mdn-url]<[Response][response-ref-url]>> Promise which resolves with a JSON object containing identifiers for the message and its recipient.

The method throws an [ErrorResponse][errorresponse-ref-url] when the request is not a successful.

### sendAsTypingBubble(params)

- `params` <[SendAsTypingBubbleParams][sendastypingbubbleparams-ref-url]> Parameters required to call the method.
- returns: <[Promise][promise-mdn-url]<[Object][object-mdn-url]>> Promise which resolves with a JSON object containing identifiers for its recipient.

### sendAsText(params)

- `params` <[SendAsTextParams][sendastextparams-ref-url]> Parameters required to call the method.
- returns: <[Promise][promise-mdn-url]<[Response][response-ref-url]>> Promise which resolves with a JSON object containing identifiers for the message and its recipient.

The method throws an [ErrorResponse][errorresponse-ref-url] when the request is not a successful.

### sendAsQuickReply(params)

- `params` <[SendAsQuickReplyParams][sendasquickreplyparams-ref-url]> Parameters required to call the method.
- returns: <[Promise][promise-mdn-url]<[Response][response-ref-url]>> Promise which resolves with a JSON object containing identifiers for the message and its recipient.

The method throws an [ErrorResponse][errorresponse-ref-url] when the request is not a successful.

### sendAsButtonTemplate(params)

- `params` <[SendAsButtonTemplateParams][sendasbuttontemplateparams-ref-url]> Parameters required to call the method.
- returns: <[Promise][promise-mdn-url]<[Response][response-ref-url]>> Promise which resolves with a JSON object containing identifiers for the message and its recipient.

The method throws an [ErrorResponse][errorresponse-ref-url] when the request is not a successful.

### sendAsGenericTemplate(params)

- `params` <[SendAsGenericTemplateParams][sendasgenerictemplateparams-ref-url]> Parameters required to call the method.
- returns: <[Promise][promise-mdn-url]<[Response][response-ref-url]>> Promise which resolves with a JSON object containing identifiers for the message and its recipient.

The method throws an [ErrorResponse][errorresponse-ref-url] when the request is not a successful.

### sendAsReceiptTemplate(params)

- `params` <[SendAsReceiptTemplateParams][sendasreceipttemplateparams-ref-url]> Parameters required to call the method.
- returns: <[Promise][promise-mdn-url]<[Response][response-ref-url]>> Promise which resolves with a JSON object containing identifiers for the message and its recipient.

The method throws an [ErrorResponse][errorresponse-ref-url] when the request is not a successful.

## License

[MIT License](https://motss.mit-license.org/) © Rong Sen Ng

<!-- References -->
[typescript-url]: https://github.com/Microsoft/TypeScript
[node-js-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[node-releases-url]: https://nodejs.org/en/download/releases
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[array-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[fb-send-api-url]: https://developers.facebook.com/docs/messenger-platform/reference/send-api
[recipient-ref-url]: #recipient
[sendasparams-ref-url]: #sendasparams
[sendasreadreceiptparams-ref-url]: #sendasreadreceiptparams
[sendastypingbubbleparams-ref-url]: #sendastypingbubbleparams
[sendastextparams-ref-url]: #sendastextparams
[sendasquickreplyparams-ref-url]: #sendasquickreplyparams
[sendasbuttontemplateparams-ref-url]: #sendasbuttontemplateparams
[sendasgenerictemplateparams-ref-url]: #sendasgenerictemplateparams
[sendasreceipttemplateparams-ref-url]: #sendasreceipttemplateparams
[response-ref-url]: #response
[errorresponse-ref-url]: #errorresponse
[custom-payload-ref-url]: #sendasparams-1
[read-receipt-ref-url]: #sendasreadreceiptparams-1
[typing-bubble-ref-url]: #sendastypingbubbleparams-1
[text-ref-url]: #sendastextparams-1
[quick-reply-ref-url]: #sendasquickreplyparams-1
[button-template-ref-url]: #sendasbuttontemplateparams-1
[generic-template-ref-url]: #sendasgenerictemplateparams-1
[receipt-template-ref-url]: #sendasreceipttemplateparams-1
[node-fetch-options-url]: https://github.com/bitinn/node-fetch#options
[send-messages-buttons-url]: https://developers.facebook.com/docs/messenger-platform/send-messages/buttons
[send-api-quick-reply-url]: https://developers.facebook.com/docs/messenger-platform/reference/send-api/quick-replies#quick_reply
[send-api-url-button-url]: https://developers.facebook.com/docs/messenger-platform/send-api-reference/url-button

[nodei-badge]: https://nodei.co/npm/@messageflow/send-as.png?downloads=true&downloadRank=true&stars=true

[travis-badge]: https://img.shields.io/travis/Messageflow/send-as.svg?style=flat-square

<!-- Badges -->
[version-badge]: https://flat.badgen.net/npm/v/@messageflow/send-as
[node-version-badge]: https://flat.badgen.net/npm/node/@messageflow/send-as
[mit-license-badge]: https://flat.badgen.net/npm/license/@messageflow/send-as

[downloads-badge]: https://flat.badgen.net/npm/dm/@messageflow/send-as
[total-downloads-badge]: https://flat.badgen.net/npm/dt/@messageflow/send-as?label=total%20downloads
[packagephobia-badge]: https://flat.badgen.net/packagephobia/install/@messageflow/send-as
[bundlephobia-badge]: https://flat.badgen.net/bundlephobia/minzip/@messageflow/send-as

[travis-badge]: https://flat.badgen.net/travis/messageflow/send-as
[circleci-badge]: https://flat.badgen.net/circleci/github/messageflow/send-as
[daviddm-badge]: https://flat.badgen.net/david/dep/messageflow/send-as
[codecov-badge]: https://flat.badgen.net/codecov/c/github/messageflow/send-as?label=codecov
[coveralls-badge]: https://flat.badgen.net/coveralls/c/github/messageflow/send-as?label=coveralls

[codebeat-badge]: https://codebeat.co/badges/cb737f7f-0fc7-4d80-afdc-41b0baf53f42?style=flat-square
[codacy-badge]: https://api.codacy.com/project/badge/Grade/dea8f78a242b4fe092c28223b960c951?style=flat-square
[coc-badge]: https://flat.badgen.net/badge/code%20of/conduct/pink

<!-- Links -->
[version-url]: https://npmjs.org/package/@messageflow/send-as
[node-version-url]: https://nodejs.org/en/download
[mit-license-url]: https://github.com/Messageflow/send-as/blob/master/LICENSE

[downloads-url]: http://www.npmtrends.com/@messageflow/send-as
[packagephobia-url]: https://packagephobia.now.sh/result?p=%40messageflow%2Fsend-as
[bundlephobia-url]: https://bundlephobia.com/result?p=@messageflow/send-as

[travis-url]: https://travis-ci.org/Messageflow/send-as
[circleci-url]: https://circleci.com/gh/Messageflow/send-as
[daviddm-url]: https://david-dm.org/Messageflow/send-as
[codecov-url]: https://codecov.io/gh/Messageflow/send-as
[coveralls-url]: https://coveralls.io/github/Messageflow/send-as?branch=master

[codebeat-url]: https://codebeat.co/projects/github-com-messageflow-send-as-master
[codacy-url]: https://www.codacy.com/app/motss/send-as?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Messageflow/send-as&amp;utm_campaign=Badge_Grade
[coc-url]: https://github.com/Messageflow/send-as/blob/master/CODE_OF_CONDUCT.md
