// @ts-check

/** Import other modules */
import sendAsReceiptTemplate from '../send-as-receipt-template';
import config, {
  killNocky,
  nocky,
  TEST_API_VERSION,
  TEST_URL,
} from './config';
import * as expected from './expected';

describe('send-as-receipt-template', () => {
  beforeEach(async () => {
    await nocky({
      url: TEST_URL,
      apiVersion: TEST_API_VERSION,
    });
  });

  afterEach(async () => await killNocky());

  test('The parameter name_placeholder[recipient_name] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsReceiptTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'receipt',
              recipient_name: null, /** recipient_name: '', */
              order_number: null,
              currency: null,
              payment_method: null,
              summary: null,
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.receiptTemplate.missingNamePlaceholderRecipientName,
      });
    }
  });

  test('The parameter name_placeholder[order_number] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsReceiptTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'receipt',
              recipient_name: 'test-receipt-template-payload-recipient-name',
              order_number: null, /** order_number: '', */
              currency: null,
              payment_method: null,
              summary: null,
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.receiptTemplate.missingNamePlaceholderOrderNumber,
      });
    }
  });

  test('The parameter name_placeholder[currency] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsReceiptTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'receipt',
              recipient_name: 'test-receipt-template-payload-recipient-name',
              order_number: 'test-receipt-template-payload-order-number',
              currency: null, /** currency: '', */
              payment_method: null,
              summary: null,
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.receiptTemplate.missingNamePlaceholderCurrency,
      });
    }
  });

  test('The currency code \'usd\' is not supported', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsReceiptTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'receipt',
              recipient_name: 'test-receipt-template-payload-recipient-name',
              order_number: 'test-receipt-template-payload-order-number',
              currency: 'usd', /** currency: 'a', */
              payment_method: null,
              summary: null,
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.receiptTemplate.currencyCodeNotSupported,
      });
    }
  });

  test('The parameter name_placeholder[payment_method] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsReceiptTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'receipt',
              recipient_name: 'test-receipt-template-payload-recipient-name',
              order_number: 'test-receipt-template-payload-order-number',
              currency: 'USD',
              payment_method: null, /** payment_method: '', */
              summary: null,
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.receiptTemplate.missingNamePlaceholderPaymentMethod,
      });
    }
  });

  test('The parameter name_placeholder[summary] is required', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsReceiptTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'receipt',
              recipient_name: 'test-receipt-template-payload-recipient-name',
              order_number: 'test-receipt-template-payload-order-number',
              currency: 'USD',
              payment_method: 'test-receipt-template-payload-payment-method',
              summary: null, /** summary: '', */
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.receiptTemplate.missingNamePlaceholderSummary,
      });
    }
  });

  // tslint:disable-next-line:max-line-length
  test('The amount you specified in payment summary is invalid. Please verify that it is a valid positive amount and is supported by its currency in terms of decimal places', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      await sendAsReceiptTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'receipt',
              recipient_name: 'test-receipt-template-payload-recipient-name',
              order_number: 'test-receipt-template-payload-order-number',
              currency: 'USD',
              payment_method: 'test-receipt-template-payload-payment-method',
              summary: {
                total_cost: 999.999, /** total_cost: '999.99', */
              },
            },
          },
        },
        recipient: {
          id: testReceipientId,
        },
      });
    } catch (e) {
      expect(e).toEqual({
        ...expected.receiptTemplate.invalidPaymentSummary,
      });
    }
  });

  test('sendAsReceiptTemplate works', async () => {
    try {
      const {
        fbGraphApiUrl,
        testReceipientId,
      } = await config();

      const d = await sendAsReceiptTemplate({
        url: `${fbGraphApiUrl}`,
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'receipt',
              recipient_name: 'test-receipt-template-payload-recipient-name',
              order_number: 'test-receipt-template-payload-order-number',
              currency: 'USD',
              payment_method: 'test-receipt-template-payload-payment-method',
              summary: {
                total_cost: 999.99,
              },
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
