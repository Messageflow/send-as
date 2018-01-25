// @ts-check

export declare interface MessageAttachment {
  type: 'image' | 'audio' | 'video' | 'file' | 'template';
  payload: {
    [key: string]: any;
  };
}
export declare interface MessageQuickReplies {
  content_type: 'text' | 'location';
  title?: string; /** Required if content_type=text & 20 char limit */
  payload?: string | number; /** Required if content_type=text & 1000 char limit */
  image_url?: string; /** Minimum 24px x 24px. Larger image will be cropped and resized */
}
export declare interface SendAsQuickReplyMessage {
  text: 'text' | 'attachment';
  attachment?: MessageAttachment;
  quick_replies: MessageQuickReplies[]; /** Up to 11 quick replies */
}
export declare interface SendAsQuickReplyParams {
  url: string;
  recipient: FbEventRecipient;
  message: SendAsQuickReplyMessage;
  notificationType?:
    'NO_PUSH'
    | 'REGULAR'
    | 'SILENT_PUSH';
  typingDelay?: number;
  options?: RequestInit;
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

/** Import other modules */
import runAfter from './run-after';
import sendAsTypingBubble from './send-as-typing-bubble';

export async function sendAsQuickReply({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsQuickReplyParams) {
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
      body: JSON.stringify({
        ...(options.body || {}),
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
      showTyping: false,
    });

    /** NOTE: Throw error response */
    if (d.status > 399) {
      throw d.data;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default sendAsQuickReply;
