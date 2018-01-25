// @ts-check

/** Import other modules */
import { sendAs } from '../';

describe('send-as', () => {
  test('url is missing', async () => {
    try {
      await sendAs({
        url: null,
        recipient: null,
        message: null,
      });
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toBe('url is missing');
    }
  });

  test('recipient is undefined', async () => {
    try {
      await sendAs({
        url: 'https://test-url.com',
        recipient: null,
        message: null,
      });
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toBe('recipient is undefined');
    }
  });

  test('recipient[id] is missing', async () => {
    try {
      await sendAs({
        url: 'https://test-url.com',
        recipient: {
          id: null,
        },
        message: null,
      });
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toBe('recipient[id] is missing');
    }
  });

  test('message is undefined', async () => {
    try {
      await sendAs({
        url: 'https://test-url.com',
        recipient: {
          id: 'test-recipient-id',
        },
        message: null,
      });
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toBe('message is undefined');
    }
  });
});
