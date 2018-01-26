// @ts-check

/** Import other modules */
import sendAsButtonTemplate from '../send-as-button-template';
import config, {
  killNocky,
  nocky,
  TEST_API_VERSION,
  TEST_URL,
} from './config';
import * as expected from './expected';

describe('send-as-button-template', () => {
  beforeEach(async () => {
    const { fbPageAccesToken } = await config();

    await nocky({
      url: TEST_URL,
      apiVersion: TEST_API_VERSION,
      pageAccessToken: fbPageAccesToken,
    });
  });

  afterEach(async () => await killNocky());

  test('The parameter name_placeholder[text] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: null,
              buttons: null,
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.buttonTemplate.missingNamePlaceholderText });
    }
  });

  test('The parameter name_placeholder[buttons] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'test-button-template',
              buttons: null,
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.buttonTemplate.missingNamePlaceholderButtons });
    }
  });

  test('name_placeholder[buttons] must not be empty', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'test button template',
              buttons: [],
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({ ...expected.buttonTemplate.emptyNamePlaceHolderButtons });
    }
  });

  test('The parameter name_placeholder[buttons][0][type] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'test button template',
              buttons: [
                {
                  type: null,
                  payload: null,
                  title: null,
                },
              ],
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.buttonTemplate.missingNamePlaceholderButtonsButtonType,
      });
    }
  });

  test('Element button title cannot be empty', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'test button template',
              buttons: [
                {
                  type: 'postback',
                  payload: null,
                  title: null,
                },
              ],
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.buttonTemplate.missingNamePlaceholderButtonsButtonTitle,
      });
    }
  });

  test(
    'Param name_placeholder[buttons][0][title] must be a non-empty UTF-8 encoded string',
    async () => {
      try {
        const {
          fbGraphApiUrl,
          testReceipientId,
        } = await config();

        await sendAsButtonTemplate({
          url: `${fbGraphApiUrl}`,
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'test button template',
                buttons: [
                  {
                    type: 'postback',
                    payload: null,
                    title: '',
                  },
                ],
              },
            },
          },
          recipient: {
            id: testReceipientId,
          },
        });
      } catch (e) {
        expect(e).toEqual({
          ...expected.buttonTemplate.emptyNamePlaceholderButtonsButtonTitle,
        });
      }
    }
  );

  test('Payload cannot be empty for postback type button', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'test button template',
              buttons: [
                {
                  type: 'postback',
                  payload: null, /** payload: '', */
                  title: 'a',
                },
              ],
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.buttonTemplate.missingPostbackTypeButtonPayload,
      });
    }
  });

  test('Web url cannot be empty for url type button', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'test button template',
              buttons: [
                {
                  type: 'web_url',
                  title: 'test-url-button-title',
                  url: null, /** url: '', */
                },
              ],
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.buttonTemplate.missingUrlTypeButtonUrl,
      });
    }
  });

  test('name_placeholder[buttons][0][url] should represent a valid URL', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'test button template',
              buttons: [
                {
                  type: 'web_url',
                  title: 'test-url-button-title',
                  url: '/test-invalid-url',
                },
              ],
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.buttonTemplate.invalidUrlButtonsUrl,
      });
    }
  });

  test('sendAsButtonTemplate works (postbackButton)', async () => {
    const {
      fbGraphApiUrl,
      testReceipientId,
    } = await config();

    try {
      const d = await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'test button template',
              buttons: [
                {
                  type: 'postback',
                  payload: 'test-postback-button-payload',
                  title: 'test-postback-button-title',
                },
              ],
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });

      expect(d).toEqual({
        recipient_id: testReceipientId,
        message_id: expect.any(String),
      });
    } catch (e) {
      throw e;
    }
  });

  test('sendAsButtonTemplate works (urlButton)', async () => {
    const {
      fbGraphApiUrl,
      testReceipientId,
    } = await config();

    try {
      const d = await sendAsButtonTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'test button template',
              buttons: [
                {
                  type: 'web_url',
                  url: 'https://test-url.com/test-url',
                  title: 'test-url-button-title',
                },
              ],
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });

      expect(d).toEqual({
        recipient_id: testReceipientId,
        message_id: expect.any(String),
      });
    } catch (e) {
      throw e;
    }
  });

});
