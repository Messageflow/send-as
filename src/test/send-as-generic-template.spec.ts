// @ts-check

/** Import other modules */
import sendAsGenericTemplate from '../send-as-generic-template';
import config, {
  killNocky,
  nocky,
  TEST_API_VERSION,
  TEST_URL,
} from './config';
import * as expected from './expected';

describe('send-as-generic-template', () => {
  beforeEach(async () => {
    await nocky({
      url: TEST_URL,
      apiVersion: TEST_API_VERSION,
    });
  });

  afterEach(async () => await killNocky());

  test('message[attachment][payload][elements] is null', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      const d = await sendAsGenericTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: null,
            },
          },
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

  test('param name_placeholder[elements] has too few elements', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsGenericTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [],
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.genericTemplate.namePlaceholderElementsTooFewElements,
      });
    }
  });

  // tslint:disable-next-line:max-line-length
  test('Incomplete element data: title and at least one other field (image url, subtitle or buttons) is required with non-empty value', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsGenericTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: null, /** title: 'test-generic-template-title', */
                  buttons: null,
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
        ...expected.genericTemplate.incompleteElementData,
      });
    }
  });

  // tslint:disable-next-line:max-line-length
  test('Param name_placeholder[elements][0][title] must be a non-empty UTF-8 encoded string', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsGenericTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: '',
                  buttons: null,
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
        ...expected.genericTemplate.emptyNamePlaceholderElementsElementTitle,
      });
    }
  });

  test('param name_placeholder[elements][0][buttons] has too few elements', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsGenericTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: 'test-generic-template-title',
                  buttons: [],
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
        ...expected.genericTemplate.namePlaceholderElementsElementButtonsTooFewElements,
      });
    }
  });

  test('sendAsGenericTemplate works (postbackButton)', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      const d = await sendAsGenericTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: 'test-generic-template-title',
                  buttons: [
                    {
                      type: 'postback',
                      title: 'test-generic-template-button-postback-title',
                      payload: 'test-generic-template-button-postback-payload',
                    },
                  ],
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
        message_id: expect.any(String),
        recipient_id: testReceipientId,
      });
    } catch (e) {
      throw e;
    }
  });

  test('sendAsGenericTemplate works (urlButton)', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      const d = await sendAsGenericTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: 'test-generic-template-title',
                  buttons: [
                    {
                      type: 'web_url',
                      title: 'test-generic-template-button-url-title',
                      url: 'https://test-url.com/test-url',
                    },
                  ],
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
        message_id: expect.any(String),
        recipient_id: testReceipientId,
      });
    } catch (e) {
      throw e;
    }
  });

});
