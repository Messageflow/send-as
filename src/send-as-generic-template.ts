// @ts-check

export declare interface DefaultAction {
  type: 'web_url';
  url: string;
  webview_height_ratio?: 'full' | 'compact' | 'tall';
  messenger_extensions?: boolean;
  fallback_url?: string; /** Required if messenger_extensions is set */
  webview_share_button?: 'hide';
}
export declare interface SendAsGenericTemplateMessagePayloadElements {
  title: string; /** 80 char limit */
  subtitle?: string; /** 80 char limit */
  image_url?: string;
  default_action?: DefaultAction;
  buttons: URLButton[] | PostbackButton[]; /** 3 btn limit */
}
export declare interface SendAsGenericTemplateMessagePayload {
  template_type: 'generic';
  shareable?: boolean; /** Defaults to false */
  image_aspect_ratio?: 'horizontal' | 'square';
  elements: SendAsGenericTemplateMessagePayloadElements[]; /** 10 elem limit */
}
export declare interface SendAsGenericTemplateMessage {
  attachment: {
    type: 'template',
    payload: SendAsGenericTemplateMessagePayload;
  };
}
export declare interface SendAsGenericTemplateParams {
  url: string;
  recipient: FbEventRecipient;
  message: SendAsGenericTemplateMessage;
  notificationType?:
    'NO_PUSH'
    | 'REGULAR'
    | 'SILENT_PUSH';
  typingDelay?: number;
  options?: RequestInit;
}

/** Import typings */
import { RequestInit } from 'node-fetch';
import {
  FbEventRecipient,
  PostbackButton,
  URLButton,
} from './';

/** Import project dependencies */
import {
  fetchAsJson,
} from 'fetch-as';

/** Import other modules */
import runAfter from './run-after';
import sendAsTypingBubble from './send-as-typing-bubble';

export async function sendAsGenericTemplate({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsGenericTemplateParams) {
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

export default sendAsGenericTemplate;
