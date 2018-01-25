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
  buttons: (URLButton | PostbackButton)[]; /** 3 btn limit */
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
import { FbEventRecipient, PostbackButton, URLButton } from './';

/** Import other modules */
import { sendAs } from './';

export async function sendAsGenericTemplate({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsGenericTemplateParams) {
  return sendAs({
    url,
    recipient,
    message,
    notificationType,
    typingDelay,
    options,
  });
}

export default sendAsGenericTemplate;
