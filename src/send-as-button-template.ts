// @ts-check

export declare interface SendAsButtonTemplateMessagePayload {
  template_type: string | 'button';
  text: string; /** 640 char limit */
  buttons: (URLButton | PostbackButton)[]; /** 3 btn limit */
}
export declare interface SendAsButtonTemplateMessage {
  attachment: {
    type: string | 'template';
    payload: SendAsButtonTemplateMessagePayload;
  };
}
export declare interface SendAsButtonTemplateParams {
  recipient: FbEventRecipient;
  message: SendAsButtonTemplateMessage;
  url: string;
  notificationType: string
    | 'NO_PUSH'
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
  PostbackButton,
  URLButton,
} from './';

/** Import project dependencies */
import {
  FetchAsData,
  fetchAsJson,
} from 'fetch-as';

/** Import other modules */
import sendTypingBubble from './send-typing-bubble';

export async function sendAsButtonTemplate({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options,
}: SendAsButtonTemplateParams) {
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
        message,
        messaging_type: 'RESPONSE',
        notification_type: notificationType || 'NO_PUSH',
      }),
    };

    /** NOTE: Always display typing bubble first */
    await sendTypingBubble({
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
    await sendTypingBubble({
      url,
      recipient,
      notificationType,
      options,
      showTyping: false,
    });

    /** NOTE: Throw error response */
    if (d.status > 399) {
      throw d;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default sendAsButtonTemplate;
