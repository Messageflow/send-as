// @ts-check

export declare interface SendAsReadReceiptParams {
  url: string;
  recipient: FbEventRecipient;
  options: RequestInit;
}

/** Import typings */
import {
  RequestInit,
} from 'node-fetch';
import {
  FbEventRecipient,
} from './';

/** Import project dependencies */
import {
  fetchAsJson
} from 'fetch-as';

export async function sendAsReadReceipt({
  url,
  recipient,
  options = {},
}: SendAsReadReceiptParams) {
  try {
    const fetchOpts = {
      ...options,
      method: 'POST',
      compress: options.compress || true,
      timeout: options.timeout || 599e3,
      headers: {
        'content-type': 'application/json',
        ...(options.headers || {}),
      },
      /**
       * NOTE:
       * When using sender_action,
       * recipient should be the only other property set in the request.
       * {@link https://goo.gl/oE1ZhB|Send API - Messenger Platform}
       */
      body: JSON.stringify({
        recipient,
        sender_action: 'mark_seen',
      }),
    };
    const d = await fetchAsJson(url, fetchOpts);

    if (d.status > 399) {
      throw d.data;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default sendAsReadReceipt;
