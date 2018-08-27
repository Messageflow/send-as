// @ts-check

import nock, { cleanAll } from 'nock';

import { sendAsReadReceipt } from '..';
import { successMessageId } from './expected';

function timeoutNock(url) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAsReadReceipt\/timeout/i.test(uri))
    .delay(5e3)
    .reply(200, () => {
      return {};
    });
}

function successNock(url, recipient, data) {
  return nock(url)
    .persist(true)
    // .log(console.log)
    .post(uri => /\/sendAsReadReceipt/i.test(uri), {
      recipient,
      sender_action: 'mark_seen',
    })
    .reply(200, () => {
      return data;
    });
}

describe('send-as-read-receipt', () => {
  const url = `${process.env.API_URL}/sendAsReadReceipt`;
  const recipient = { id: '123' };
  const data = {
    ...successMessageId,
  };
  let nocks: (nock.Scope)[];

  beforeAll(() => {
    nocks = [
      timeoutNock(url),
      successNock(url, recipient, data),
    ];
  });

  describe('error', () => {
    it(`throws when undefined 'url'`, async () => {
      try {
        await sendAsReadReceipt({
          url: null!,
          recipient: null!,
        });
      } catch (e) {
        expect(e).toStrictEqual(
          new TypeError(`Expected 'url' to be a valid URL, but received 'null'`));
      }
    });

    it(`throws when undefined 'recipient'`, async () => {
      try {
        await sendAsReadReceipt({
          url,
          recipient: null!,
        });
      } catch (e) {
        expect(e).toStrictEqual(
          new TypeError(`Expected 'recipient' to have a valid ID, but received 'null'`));
      }
    });

    it(`throws when 'recipient[id]' is not a string`, async () => {
      try {
        await sendAsReadReceipt({
          url,
          recipient: { id: null! },
        });
      } catch (e) {
        expect(e).toStrictEqual(
          new TypeError(`Expected 'recipient' to have a valid ID, but received '{"id":null}'`));
      }
    });

    it('throws when socket timed out', async () => {
      try {
        await sendAsReadReceipt({
          recipient,
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
        const d = await sendAsReadReceipt({
          url,
          recipient,
        });

        expect(d).toStrictEqual(data);
      } catch (e) {
        throw e;
      }
    });

    it(`returns with defined 'options'`, async () => {
      try {
        const d = await sendAsReadReceipt({
          url,
          recipient,
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
