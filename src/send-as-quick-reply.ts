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
  text: string;
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
import { RequestInit } from 'node-fetch';
import { FbEventRecipient } from './';

/** Import other modules */
import { sendAs } from './';

export async function sendAsQuickReply({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsQuickReplyParams) {
  return sendAs({
    url,
    recipient,
    message,
    notificationType,
    typingDelay,
    options,
  });
}

export default sendAsQuickReply;
