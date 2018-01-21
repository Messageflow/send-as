// @ts-check

export declare interface SendAsReceiptTemplateMessagePayloadElements {
  title: string; /** 80 char limit */
  subtitle?: string; /** 80 char limit */
  quantity?: number;
  price: number;
  currency?: string;
  image_url?: string;
}
export declare interface SendAsReceiptTemplateMessagePayloadAddress {
  street_1: string;
  street_2?: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
}
export declare interface SendAsReceiptTemplateMessagePayloadSummary {
  subtotal?: number;
  shipping_cost?: number;
  total_tax?: number;
  total_cost: number;
}
export declare interface SendAsReceiptTemplateMessagePayloadAdjustment {
  name: string;
  amount: number;
}
export declare interface SendAsReceiptTemplateMessagePayload {
  template_type: string | 'receipt';
  shareable?: boolean;
  recipient_name: string;
  merchant_name?: string;
  order_number: string;
  currency: string;
  payment_method: string;
  order_url?: string;
  timestamp?: number;
  address?: SendAsReceiptTemplateMessagePayloadAddress;
  summary: SendAsReceiptTemplateMessagePayloadSummary;
  adjustments?: SendAsReceiptTemplateMessagePayloadAdjustment[];
  elements: SendAsReceiptTemplateMessagePayloadElements[]; /** 100 elem limit */
}
export declare interface SendAsReceiptTemplateMessage {
  attachment: {
    type: string | 'template',
    payload: SendAsReceiptTemplateMessagePayload;
  };
}
export declare interface SendAsReceiptTemplateParams {
  url: string;
  recipient: FbEventRecipient;
  message: SendAsReceiptTemplateMessage;
  notificationType: string
    | 'NO_PUSH'
    | 'REGULAR'
    | 'SILENT_PUSH';
  typingDelay: number;
  options: RequestInit;
}

/** Import typings */
import {
  FetchAsData,
} from 'fetch-as';
import {
  RequestInit,
} from 'node-fetch';
import {
  FbEventRecipient,
} from './';

/** Import project dependencies */
import {
  fetchAsJson,
} from 'fetch-as';

/** Import other modules */
import sendAsTypingBubble from './send-as-typing-bubble';

export async function sendAsReceiptTemplate({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsReceiptTemplateParams) {
  try {
    const fetchOpts = {
      method: 'POST',
      compress: true,
      timeout: options.timeout || 599e3,
      headers: {
        'content-type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify({
        recipient,
        message,
        messaging_type: 'RESPONSE',
        notification_type: notificationType || 'NO_PUSH',
      }),
    };

    /** NOTE: Always display typing bubble first */
    await sendAsTypingBubble({
      url,
      recipient,
      notificationType,
      options,
      showTyping: true,
    });

    const d = await new Promise<FetchAsData>((yay, nah) => {
      setTimeout(async () => {
        try {
          const j = await fetchAsJson(url, fetchOpts);

          if (j.status > 399) {
            throw j;
          }

          yay(j);
        } catch (e) {
          nah(e);
        }
      }, typingDelay || 250);
    });

    /** NOTE: Turn typing indicator off */
    await sendAsTypingBubble({
      url,
      recipient,
      notificationType,
      options,
      showTyping: false,
    });

    if (d.status > 399) {
      throw d.data;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default sendAsReceiptTemplate;
