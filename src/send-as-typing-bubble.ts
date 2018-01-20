// @ts-check

export declare interface SendTypingBubbleParams {
  url: string;
  recipient: FbEventRecipient;
  options: RequestInit;
  notificationType: string
    | 'NO_PUSH'
    | 'REGULAR'
    | 'SILENT_PUSH';
  showTyping: boolean;
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
  fetchAsJson,
} from 'fetch-as';

export async function sendTypingBubble({
  url,
  recipient,
  options,
  notificationType,
  showTyping = true,
}: SendTypingBubbleParams) {
  try {
    const fetchOpts = {
      method: 'POST',
      compress: options.compress || true,
      timeout: options.timeout || 599e3,
      headers: {
        'content-type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify({
        recipient,
        messaging_type: 'RESPONSE',
        sender_action: showTyping ? 'typing_on' : 'typing_off',
        notification_type: notificationType || 'NO_PUSH',
      }),
    };
    const d = await fetchAsJson(url, fetchOpts);

    /** NOTE: Throw error response */
    if (d.status > 399) {
      throw d.data;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default sendTypingBubble;
