// @ts-check

import nock from 'nock';

import {
  NotificationType,
  sendAsButtonTemplate,
  sendAsGenericTemplate,
  sendAsQuickReply,
  sendAsReceiptTemplate,
  sendAsText,
  URLButton,
} from '..';
import {
  emptyMessage,
  successMessageId,
} from './expected';

function errorTextNock(url, recipient, data) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAs\/text\/error/i.test(uri), {
      recipient,
      message: { text: null },
      messaging_type: 'RESPONSE',
      notification_type: NotificationType.NO_PUSH,
    })
    .reply(400, () => {
      return data;
    });
}

function typingBubbleNock(url, recipient) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAs/i.test(uri), {
      recipient,
      sender_action: /^typing_(on|off)/i,
    })
    .reply(200, () => {
      return {};
    });
}

function successTextNock(url, recipient, data) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAs\/text/i.test(uri), {
      recipient,
      message: { text: '123' },
      messaging_type: 'RESPONSE',
      notification_type: new RegExp(`(${
        NotificationType.NO_PUSH}|${NotificationType.REGULAR})`, 'i'),
    })
    .reply(200, () => {
      return data;
    });
}

function successQuickReplyNock(url, recipient, data) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAs\/quickReply/i.test(uri), {
      recipient,
      message: {
        text: '123',
        quick_replies: [
          {
            content_type: 'text',
            title: '123',
            payload: '123',
          },
        ],
      },
      messaging_type: 'RESPONSE',
      notification_type: NotificationType.NO_PUSH,
    })
    .reply(200, () => {
      return data;
    });
}

function successButtonNock(url, recipient, data) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAs\/button/i.test(uri), {
      recipient,
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: '123',
            buttons: [
              {
                type: 'web_url',
                title: '123',
                url: 'https://example.com',
              },
            ],
          },
        },
      },
      messaging_type: 'RESPONSE',
      notification_type: NotificationType.NO_PUSH,
    })
    .reply(200, () => {
      return data;
    });
}

function successGenericNock(url, recipient, data) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAs\/generic/i.test(uri), {
      recipient,
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: '123',
                buttons: [
                  {
                    type: 'web_url',
                    title: '123',
                    url: 'https://example.com',
                  },
                ],
              },
            ],
          },
        },
      },
      messaging_type: 'RESPONSE',
      notification_type: NotificationType.NO_PUSH,
    })
    .reply(200, () => {
      return data;
    });
}

function successReceiptNock(url, recipient, data) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAs\/receipt/i.test(uri), {
      recipient,
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'receipt',
            currency: 'USD',
            payment_method: 'Visa',
            order_number: '123',
            recipient_name: 'Cash Black',
            summary: {
              total_cost: 123,
            },
          },
        },
      },
      messaging_type: 'RESPONSE',
      notification_type: NotificationType.NO_PUSH,
    })
    .reply(200, () => {
      return data;
    });
}

describe('send-as', () => {
  const url = `${process.env.API_URL}/sendAs`;
  const recipient = {
    id: '123',
  };
  const data = {
    ...successMessageId,
  };
  let nocks: (nock.Scope)[];

  beforeAll(() => {
    nocks = [
      errorTextNock(url, recipient, emptyMessage),

      typingBubbleNock(url, recipient),
      successTextNock(url, recipient, data),
      successQuickReplyNock(url, recipient, data),
      successButtonNock(url, recipient, data),
      successGenericNock(url, recipient, data),
      successReceiptNock(url, recipient, data),
    ];
  });

  describe('error', () => {
    it(`throws when undefined 'message'`, async () => {
      try {
        await sendAsText({
          url,
          recipient,
          message: null!,
        });
      } catch (e) {
        expect(e).toStrictEqual(
          new TypeError(`Expected 'message' to be defined, but received 'null'`));
      }
    });

    it(`throws when error occurs`, async () => {
      try {
        await sendAsText({
          recipient,
          url: `${url}/text/error`,
          message: { text: null! },
        });
      } catch (e) {
        expect(e).toStrictEqual(emptyMessage);
      }
    });

  });

  describe('ok', () => {
    it(`returns with 'sendAsText'`, async () => {
      try {
        const d = await sendAsText({
          recipient,
          url: `${url}/text`,
          message: { text: '123' },
        });
      } catch (e) {
        throw e;
      }
    });

    it(`returns with 'sendAsQuickReply'`, async () => {
      try {
        const d = await sendAsQuickReply({
          recipient,
          url: `${url}/quickReply`,
          message: {
            text: '123',
            quick_replies: [
              {
                content_type: 'text',
                title: '123',
                payload: '123',
              },
            ],
          },
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    });

    it(`returns with 'sendAsButtonTemplate'`, async () => {
      try {
        const d = await sendAsButtonTemplate<URLButton>({
          recipient,
          url: `${url}/button`,
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: '123',
                buttons: [
                  {
                    type: 'web_url',
                    title: '123',
                    url: 'https://example.com',
                  },
                ],
              },
            },
          },
        });
      } catch (e) {
        throw e;
      }
    });

    it(`returns with 'sendAsGenericTemplate'`, async () => {
      try {
        const d = await sendAsGenericTemplate<URLButton>({
          recipient,
          url: `${url}/generic`,
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'generic',
                elements: [
                  {
                    title: '123',
                    buttons: [
                      {
                        type: 'web_url',
                        title: '123',
                        url: 'https://example.com',
                      },
                    ],
                  },
                ],
              },
            },
          },
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    });

    it(`returns with 'sendAsReceiptTemplate'`, async () => {
      try {
        const d = await sendAsReceiptTemplate({
          recipient,
          url: `${url}/receipt`,
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'receipt',
                currency: 'USD',
                payment_method: 'Visa',
                order_number: '123',
                recipient_name: 'Cash Black',
                summary: {
                  total_cost: 123,
                },
              },
            },
          },
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    });

    it(`returns with defined 'typingDelay'`, async () => {
      try {
        const d = await sendAsText({
          recipient,
          url: `${url}/text`,
          message: { text: '123' },
          typingDelay: 500,
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    });

    it(`returns with defined 'notificationType'`, async () => {
      try {
        const d = await sendAsText({
          recipient,
          url: `${url}/text`,
          message: { text: '123' },
          notificationType: NotificationType.REGULAR,
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    });

    it(`returns with defined 'options'`, async () => {
      try {
        const d = await sendAsText({
          recipient,
          url: `${url}/text`,
          message: { text: '123' },
          options: { timeout: 3e3 },
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    });

  });

  afterAll(() => {
    nocks.forEach(n => n.persist(false));
    nock.cleanAll();
  });
});
