// @ts-check

/** Import other modules */
import sendAsText from '../send-as-text';
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

  test('Message cannot be empty, must provide valid attachment or text', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsText({
        url: `${fbGraphApiUrl}`,
        message: {
          text: null, /** text: '', */
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.emptyMessage,
      });
    }
  });

  test('sendAsText works', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      const d = await sendAsText({
        url: `${fbGraphApiUrl}`,
        message: {
          text: 'Hello, World!',
        },
        recipient: {
          id: testReceipientId,
        },
      });

      expect(d).toEqual({
        message_id: expect.any(String),
        recipient_id: testReceipientId,
      });
    } catch (e) {
      throw e;
    }
  });

});
