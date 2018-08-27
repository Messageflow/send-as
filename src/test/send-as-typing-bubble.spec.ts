// @ts-check

import { MessengerId } from '..';

import { sendAsTypingBubble } from '..';
import config, {
  // killNocky,
  // nocky,
  // TEST_API_VERSION,
  // TEST_URL,
} from './config';
import * as expected from './expected';

describe('send-as-text', () => {
  // beforeAll(() => {});
  const url = `${process.env.API_URL}/sendAsText`;
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

    // it('throws when socket timed out', async () => {
    //   try {
    //     await sendAsTypingBubble({
    //       url,
    //       recipient,
    //       showTyping,
    //     });
    //   } catch (e) {
    //     expect(e.type).toStrictEqual('request-timeout');
    //     expect(e.name).toStrictEqual('FetchError');
    //     expect(e.name).toStrictEqual(`network timeout at: ${url}/timeout`);
    //   }
    // }, 10e3);

  });

  describe('ok', () => {
    // it();

  });

  // afterAll(() => {});
  // beforeEach(async () => {
  //   await nocky({
  //     url: TEST_URL,
  //     apiVersion: TEST_API_VERSION,
  //   });
  // });

  // afterEach(async () => await killNocky());

  // test('sendAsTypingBubble fails', async () => {
  //   try {
  //     const {
  //       fbGraphApiUrl,
  //       testReceipientId,
  //     } = await config();

  //     await sendAsTypingBubble({
  //       url: `${fbGraphApiUrl}/error`,
  //       recipient: {
  //         id: testReceipientId,
  //       },
  //     });
  //   } catch (e) {
  //     expect(e).toEqual({
  //       ...expected.missingSenderAction,
  //     });
  //   }
  // });

  // test('sendAsTypingBubble works', async () => {
  //   try {
  //     const {
  //       fbGraphApiUrl,
  //       testReceipientId,
  //     } = await config();

  //     const d = await sendAsTypingBubble({
  //       url: `${fbGraphApiUrl}`,
  //       recipient: {
  //         id: testReceipientId,
  //       },
  //     });

  //     expect(d).toEqual({
  //       recipient_id: testReceipientId,
  //     });
  //   } catch (e) {
  //     throw e;
  //   }
  // });

});
