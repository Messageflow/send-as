// @ts-check

export declare interface DefaultAction {
  title: string; /** 20 char limit */
  url: string;
  webview_height_ratio?: string | 'full' | 'compact' | 'tall';
  messenger_extensions?: boolean;
  fallback_url?: string; /** Required if messenger_extensions is set */
  webview_share_button?: string | 'hide';
}
export declare interface SendAsGenericTemplateMessagePayloadElements {
  title: string; /** 80 char limit */
  subtitle?: string; /** 80 char limit */
  image_url?: string;
  default_action?: DefaultAction;
  buttons: URLButton[] | PostbackButton[];
}
export declare interface SendAsGenericTemplateMessagePayload {
  template_type: string | 'generic';
  shareable?: boolean;
  image_aspect_ratio?: string | 'horizontal' | 'square';
  elements: SendAsGenericTemplateMessagePayloadElements[]; /** 10 elem limit */
}
export declare interface SendAsGenericTemplateMessage {
  attachment: {
    type: string | 'template',
    payload: SendAsGenericTemplateMessagePayload;
  };
}
export declare interface SendAsGenericTemplateParams {
  url: string;
  recipient: FbEventRecipient;
  message: SendAsGenericTemplateMessage;
  notificationType: string
    | 'NO_PUSH'
    | 'REGULAR'
    | 'SILENT_PUSH';
  typingDelay: number;
  options: RequestInit;
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

    /** NOTE: Always display typing bubble first */
    await sendAsTypingBubble({
      url,
      recipient,
      notificationType,
      options,
      showTyping: true,
    });

    await runAfter(typingDelay);

    const d = await fetchAsJson(url, fetchOpts);

    /** NOTE: Turn typing indicator off */
    await sendAsTypingBubble({
      url,
      recipient,
      notificationType,
      options,
      showTyping: false,
    });

    if (d.status > 399) {
      throw d.data;
    }

    return d.data;
  } catch (e) {
    throw e;
  }
}

export default sendAsGenericTemplate;
