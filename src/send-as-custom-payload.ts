// @ts-check

export declare interface SendAsCustomPayloadMessage {
  [key: string]: any;
}
export declare interface SendAsCustomPayloadParams {
  recipient: FbEventRecipient;
  message: SendAsCustomPayloadMessage;
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
import { FbEventRecipient } from './';

/** Import other modules */
import { sendAs } from './';

export async function sendAsCustomPayload({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsCustomPayloadParams) {
  return sendAs({
    url,
    recipient,
    message,
    notificationType,
    typingDelay,
    options,
  });
}

export default sendAsCustomPayload;
