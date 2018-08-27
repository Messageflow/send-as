// @ts-check

/** Import other modules */
import { sendAs } from '../';
import config, {
  killNocky,
  nocky,
  TEST_API_VERSION,
  TEST_URL,
} from './config';
import * as expected from './expected';

describe.skip('send-as', () => {
  beforeEach(async () => {
    await nocky({
      url: TEST_URL,
      apiVersion: TEST_API_VERSION,
    });
  });

  afterEach(async () => await killNocky());

  test('url is missing', async () => {
    try {
      await sendAs({
        url: null,
        recipient: null,
        message: null,
      });
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toBe('Param params[url] is missing');
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
      expect(e.message).toBe('Param params[recipient] is undefined');
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
      expect(e.message).toBe('Param params[recipient][id] is missing');
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
      expect(e.message).toBe('Param params[message] is undefined');
    }
  });

  test('Message cannot be empty, must provide valid attachment or text', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAs({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: null,
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.emptyMessage });
    }
  });

  test('The parameter message[attachment][type] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAs({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: null,
            payload: null,
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.missingMessageAttachmentType });
    }
  });

  test('The parameter message[attachment][payload] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAs({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: null,
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.missingMessageAttachmentPayload });
    }
  });

  /** NOTE: Test for templates */
  test('Invalid template type', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAs({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: null,
              elements: null,
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.invalidTemplateType });
    }
  });

  test('sendAs works (sending as custom payload)', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      const d = await sendAs({
        url: `${fbGraphApiUrl}`,
        message: {
          text: 'test-send-as-text',
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
