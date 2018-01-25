// @ts-check

export declare interface SendAsButtonTemplateMessagePayload {
  template_type: 'button';
  text: string; /** 640 char limit */
  buttons: (URLButton | PostbackButton)[]; /** 3 btn limit */
}
export declare interface SendAsButtonTemplateMessage {
  attachment: {
    type: 'template';
    payload: SendAsButtonTemplateMessagePayload;
  };
}
export declare interface SendAsButtonTemplateParams {
  recipient: FbEventRecipient;
  message: SendAsButtonTemplateMessage;
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
import { FbEventRecipient, PostbackButton, URLButton } from './';

/** Import other modules */
import { sendAs } from './';

export async function sendAsButtonTemplate({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsButtonTemplateParams) {
  return sendAs({
    url,
    recipient,
    message,
    notificationType,
    typingDelay,
    options,
  });
}

export default sendAsButtonTemplate;
