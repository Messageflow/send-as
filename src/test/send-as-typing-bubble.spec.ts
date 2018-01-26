// @ts-check

/** Import other modules */
import sendAsTypingBubble from '../send-as-typing-bubble';
import config, {
  killNocky,
  nocky,
  TEST_API_VERSION,
  TEST_URL,
} from './config';
import * as expected from './expected';

describe('send-as-text', () => {
  beforeEach(async () => {
    await nocky({
      url: TEST_URL,
      apiVersion: TEST_API_VERSION,
    });
  });

  afterEach(async () => await killNocky());

  test('sendAsTypingBubble fails', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsTypingBubble({
        url: `${fbGraphApiUrl}/error`,
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.missingSenderAction,
      });
    }
  });

  test('sendAsTypingBubble works', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      const d = await sendAsTypingBubble({
        url: `${fbGraphApiUrl}`,
        recipient: {
          id: testReceipientId,
        },
      });

      expect(d).toEqual({
        recipient_id: testReceipientId,
      });
    } catch (e) {
      throw e;
    }
  });

});
