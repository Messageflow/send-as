// @ts-check

export declare interface SendAsTextMessage {
  text: string; /** 2000 char limit */
}
export declare interface SendAsTextParams {
  url: string;
  recipient: FbEventRecipient;
  message: SendAsTextMessage;
  notificationType:
    'NO_PUSH'
    | 'REGULAR'
    | 'SILENT_PUSH';
  typingDelay: number;
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
// import pMapSeries from 'p-map-series';
import {
  fetchAsJson,
} from 'fetch-as';

/** Import other modules */
import runAfter from './run-after';
import sendAsTypingBubble from './send-as-typing-bubble';

export async function sendAsText({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsTextParams) {
  try {
    const fetchOpts = {
      ...options,
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

    /** NOTE: Always show typing bubble first */
    await sendAsTypingBubble({
      url,
      recipient,
      options,
      showTyping: true,
    });

    await runAfter(typingDelay);

    const d = await fetchAsJson(url, fetchOpts);

    /** NOTE: Turn typing indicator off */
    await sendAsTypingBubble({
      url,
      recipient,
      options,
      showTyping: true,
    });

    if (d.status > 399) {
      throw d.data;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default sendAsText;
