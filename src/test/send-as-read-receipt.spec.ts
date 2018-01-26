// @ts-check

/** Import other modules */
import sendAsReadReceipt from '../send-as-read-receipt';
import config, {
  killNocky,
  nocky,
  TEST_API_VERSION,
  TEST_URL,
} from './config';

describe('send-as-read-receipt', () => {
  beforeEach(async () => {
    const { fbPageAccesToken } = await config();

    await nocky({
      url: TEST_URL,
      apiVersion: TEST_API_VERSION,
      pageAccessToken: fbPageAccesToken,
    });
  });

  afterEach(async () => await killNocky());

  test('sendAsReadReceipt fails', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsReadReceipt({
        url: `${fbGraphApiUrl}/error`,
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        error: {
          message: 'Should return error',
        },
      });
    }
  });

  test('sendAsReadReceipt works', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      const d = await sendAsReadReceipt({
        url: `${fbGraphApiUrl}`,
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
