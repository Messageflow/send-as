// @ts-check

/** Import other modules */
import sendAsQuickReply from '../send-as-quick-reply';
import config, {
  killNocky,
  nocky,
  TEST_API_VERSION,
  TEST_URL,
} from './config';
import * as expected from './expected';

describe('send-as-quick-reply', () => {
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

      await sendAsQuickReply({
        url: `${fbGraphApiUrl}`,
        message: {
          text: null, /** text: '', */
          quick_replies: null,
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

  test('param message[quick_replies] has too few elements', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsQuickReply({
        url: `${fbGraphApiUrl}`,
        message: {
          text: 'text',
          quick_replies: [],
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.quickReplies.messageQuickRepliesTooFewElements,
      });
    }
  });

  test('The parameter message[quick_replies][0][content_type] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsQuickReply({
        url: `${fbGraphApiUrl}`,
        message: {
          text: 'text',
          quick_replies: [
            {
              content_type: null,
              title: null,
              payload: null,
            },
          ],
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.quickReplies.missingMessageQuickRepliesQuickReplyContentType,
      });
    }
  });

  test('Title is required for this quick reply content type', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsQuickReply({
        url: `${fbGraphApiUrl}`,
        message: {
          text: 'text',
          quick_replies: [
            {
              content_type: 'text',
              title: null,
              payload: null,
            },
          ],
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.quickReplies.missingMessageQuickRepliesQuickReplyTitle,
      });
    }
  });

  test('Payload is required for this quick reply content type', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsQuickReply({
        url: `${fbGraphApiUrl}`,
        message: {
          text: 'text',
          quick_replies: [
            {
              content_type: 'text',
              title: 'test-message-quick-replies-title', /** title: '', */
              payload: null,
            },
          ],
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.quickReplies.missingMessageQuickRepliesQuickReplyPayload,
      });
    }
  });

  test('sendAsQuickReply works (content_type=text)', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      const d = await sendAsQuickReply({
        url: `${fbGraphApiUrl}`,
        message: {
          text: 'text',
          quick_replies: [
            {
              content_type: 'text',
              title: 'test-message-quick-replies-title',
              payload: 'test-message-quick-replies-payload',
            },
          ],
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
