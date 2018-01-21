// @ts-check

export declare interface SendAsTextMessage {
  text: string;
}
export declare interface SendAsTextParams {
  url: string;
  recipient: FbEventRecipient;
  message: SendAsTextMessage;
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
// import pMapSeries from 'p-map-series';
import {
  fetchAsJson,
} from 'fetch-as';

/** Import other modules */
// import chunkMessage from '../helper/chunk-message';
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
      method: 'POST',
      compress: true,
      timeout: options.timeout || 599e3,
      headers: {
        'content-type': 'application/json',
        ...(options.headers || {}),
      },
    };

    /** NOTE: Always show typing bubble first */
    await sendAsTypingBubble({
      url,
      recipient,
      notificationType,
      options,
      showTyping: true,
    });

    /** FIXME: Needs optimization so badly!!! */
    const d = await new Promise<FetchAsData>((yay, nah) => {
      setTimeout(async () => {
        try {
          const msgSent = message.text.length > 640
            ? await pMapSeries(
              await chunkMessage(message.text),
              async (msgChunk) => {
                await sendAsTypingBubble({
                  url,
                  recipient,
                  notificationType,
                  options,
                  showTyping: true,
                });

                const fetchOptsForMsgChunk = {
                  ...fetchOpts,
                  body: JSON.stringify({
                    recipient,
                    messaging_type: 'RESPONSE',
                    message: {
                      text: msgChunk,
                    },
                    notification_type: notificationType || 'NO_PUSH',
                  }),
                };
                const msgChunkSent = await fetchAsJson(url, fetchOptsForMsgChunk);

                await sendAsTypingBubble({
                  url,
                  recipient,
                  notificationType,
                  options,
                  showTyping: false,
                });

                return msgChunkSent;
              }
            )
            : await fetchAsJson(url, {
              ...fetchOpts,
              body: JSON.stringify({
                recipient,
                message,
                messaging_type: 'RESPONSE',
                notification_type: notificationType || 'NO_PUSH',
              }),
            });

          yay(msgSent);
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
