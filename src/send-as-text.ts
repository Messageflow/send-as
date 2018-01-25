// @ts-check

export declare interface SendAsTextMessage {
  text: string; /** 2000 char limit */
}
export declare interface SendAsTextParams {
  url: string;
  recipient: FbEventRecipient;
  message: SendAsTextMessage;
  notificationType?:
    'NO_PUSH'
    | 'REGULAR'
    | 'SILENT_PUSH';
  typingDelay?: number;
  options?: RequestInit;
}

/** Import typings */
import { RequestInit } from 'node-fetch';
import { FbEventRecipient } from './';

/** Import other modules */
import { sendAs } from './';

export async function sendAsText({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsTextParams) {
  return sendAs({
    url,
    recipient,
    message,
    notificationType,
    typingDelay,
    options,
  });
}

export default sendAsText;
