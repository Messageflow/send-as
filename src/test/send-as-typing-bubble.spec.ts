// @ts-check

import { MessengerId } from '..';

import nock from 'nock';

import { sendAsTypingBubble } from '..';
import { successMessageId } from './expected';

function timeoutNock(url) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAsTypingBubble\/timeout/i.test(uri))
    .delay(5e3)
    .reply(200, () => {
      return {};
    });
}

function successNock(url, data) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAsTypingBubble/i.test(uri))
    .reply(200, () => {
      return data;
    });
}

describe('send-as-typing-bubble', () => {
  const data = {
    ...successMessageId,
  };
  let nocks: (nock.Scope)[];

  beforeAll(() => {
    nocks = [
      timeoutNock(url),
      successNock(url, data),
    ];
  });

  const url = `${process.env.API_URL}/sendAsTypingBubble`;
  const recipient: MessengerId = {
    id: '123',
  };
  const showTyping = true;

  describe('error', () => {
    it(`throws when undefined 'url'`, async () => {
      try {
        await sendAsTypingBubble({
          url: null!,
          recipient: null!,
          showTyping: null!,
        });
      } catch (e) {
        expect(e).toStrictEqual(
          new TypeError(`Expected 'url' to be a valid URL, but received 'null'`));
      }
    });

    it(`throws when undefined 'recipient'`, async () => {
      try {
        await sendAsTypingBubble({
          url,
          recipient: null!,
          showTyping: null!,
        });
      } catch (e) {
        expect(e).toStrictEqual(
          new TypeError(`Expected 'recipient' to have a valid ID, but received 'null'`));
      }
    });

    it(`throws when 'recipient[id]' is not a string`, async () => {
      try {
        await sendAsTypingBubble({
          url,
          recipient: { id: null! },
          showTyping: null!,
        });
      } catch (e) {
        expect(e).toStrictEqual(
          new TypeError(`Expected 'recipient' to have a valid ID, but received '{"id":null}'`));
      }
    });

    it(`throws when undefined 'showTyping'`, async () => {
      try {
        await sendAsTypingBubble({
          url,
          recipient,
          showTyping: null!,
        });
      } catch (e) {
        expect(e).toStrictEqual(
          new TypeError(`Expected 'showTyping' to be of type 'boolean', but received 'null'`));
      }
    });

    it('throws when socket timed out', async () => {
      try {
        await sendAsTypingBubble({
          recipient,
          showTyping,
          url: `${url}/timeout`,
          options: { timeout: 3e3 },
        });
      } catch (e) {
        expect(e.type).toStrictEqual('request-timeout');
        expect(e.name).toStrictEqual('FetchError');
        expect(e.message).toStrictEqual(`network timeout at: ${url}/timeout`);
      }
    }, 10e3);

  });

  describe('ok', () => {
    it('returns', async () => {
      try {
        const d = await sendAsTypingBubble({
          url,
          recipient,
          showTyping: true,
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    });

    it(`returns with 'showTyping' set to 'false'`, async () => {
      try {
        const d = await sendAsTypingBubble({
          url,
          recipient,
          showTyping: false,
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    });

    it(`returns with defined 'options'`, async () => {
      try {
        const d = await sendAsTypingBubble({
          url,
          recipient,
          showTyping: true,
          options: { timeout: 3e3 },
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    }, 10e3);

  });

  afterAll(() => {
    nocks.forEach(n => n.persist(false));
    nock.cleanAll();
  });
});
