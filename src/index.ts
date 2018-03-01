// @ts-check

export interface PostbackButton {
  type: 'postback';
  title: string; /** 20 char limit */
  payload: string; /** 1000 char limit */
}
export interface URLButton {
  type: 'web_url';
  title: string; /** 20 char limit */
  url: string;
  webview_height_ratio?: 'full' | 'compact' | 'tall';
  messenger_extensions?: boolean;
  fallback_url?: string; /** Required if messenger_extensions is set */
  webview_share_button?: 'hide';
}
export declare interface FbEventRecipient {
  id: string;
}
export declare interface SendAsMessage {
  [key: string]: any;
}
export declare interface SendAsParams {
  recipient: FbEventRecipient;
  message:
    SendAsButtonTemplateMessage |
    SendAsGenericTemplateMessage |
    SendAsQuickReplyMessage |
    SendAsReceiptTemplateMessage |
    SendAsTextMessage |
    SendAsMessage;
  url: string;
  notificationType?:
    'NO_PUSH'
    | 'REGULAR'
    | 'SILENT_PUSH';
  typingDelay?: number;
  options?: RequestInit;
}

/** Import typings */
import { RequestInit } from 'node-fetch';
import { SendAsButtonTemplateMessage } from './send-as-button-template';
import { SendAsGenericTemplateMessage } from './send-as-generic-template';
import { SendAsQuickReplyMessage } from './send-as-quick-reply';
import { SendAsReceiptTemplateMessage } from './send-as-receipt-template';
import { SendAsTextMessage } from './send-as-text';

/** Import other modules */
import { fetchAsJson } from 'fetch-as';
import runAfter from './run-after';
import sendAsTypingBubble from './send-as-typing-bubble';

export async function sendAs({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {} as RequestInit,
}: SendAsParams) {
  try {
    if (typeof url !== 'string' || !url.length) {
      throw new TypeError('Param params[url] is missing');
    }

    if (recipient == null) {
      throw new TypeError('Param params[recipient] is undefined');
    }

    if (
      typeof (recipient && recipient.id) !== 'string'
        || !((recipient && recipient.id).length)
    ) {
      throw new TypeError('Param params[recipient][id] is missing');
    }

    if (message == null) {
      throw new TypeError('Param params[message] is undefined');
    }

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
      throw d.error;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export * from './send-as-button-template';
export * from './send-as-generic-template';
export * from './send-as-quick-reply';
export * from './send-as-read-receipt';
export * from './send-as-receipt-template';
export * from './send-as-text';
export * from './send-as-typing-bubble';

export default sendAs;
