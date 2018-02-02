// @ts-check

export declare interface SendAsTypingBubbleParams {
  url: string;
  recipient: FbEventRecipient;
  options?: RequestInit;
  showTyping?: boolean;
}

/** Import typings */
import { RequestInit } from 'node-fetch';
import { FbEventRecipient } from './';

/** Import project dependencies */
import { fetchAsJson } from 'fetch-as';

export async function sendAsTypingBubble({
  url,
  recipient,
  showTyping = true,
  options = {} as RequestInit,
}: SendAsTypingBubbleParams) {
  try {
    const fetchOpts = {
      ...options,
      method: 'POST',
      compress: options.compress || true,
      timeout: options.timeout || 599e3,
      headers: {
        ...(options.headers || {}),
        'content-type': 'application/json',
      },
      /**
       * NOTE:
       * When using sender_action,
       * recipient should be the only other property set in the request.
       * {@link https://goo.gl/oE1ZhB|Send API - Messenger Platform}
       */
      body: JSON.stringify({
        recipient,
        sender_action: showTyping ? 'typing_on' : 'typing_off',
      }),
    };
    const d = await fetchAsJson(url, fetchOpts);

    /** NOTE: Throw error response */
    if (d.status > 399) {
      throw d.error;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default sendAsTypingBubble;
