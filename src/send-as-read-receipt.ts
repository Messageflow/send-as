// @ts-check

export declare interface SendAsReadReceiptParams {
  url: string;
  recipient: FbEventRecipient;
  notificationType: string
    | 'NO_PUSH'
    | 'REGULAR'
    | 'SILENT_PUSH';
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
  notificationType,
  options = {},
}: SendAsReadReceiptParams) {
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
        messaging_type: 'RESPONSE',
        sender_action: 'mark_seen',
        notificationType: notificationType || 'NO_PUSH',
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
