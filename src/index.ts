// @ts-check

export const enum ContentType {
  TEXT = 'text',
  LOCATION = 'location',
  USER_PHONE_NUMBER = 'user_phone_number',
  USER_EMAIL = 'user_email',
}
export const enum AttachmentType {
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  FILE = 'file',
  TEMPLATE = 'template',
}
export const enum NotificationType {
  NO_PUSH = 'NO_PUSH',
  REGULAR = 'REGULAR',
  SILENT_PUSH = 'SILENT_PUSH',
}
export const enum WebviewHeightRatio {
  FULL = 'full',
  COMPACT = 'compact',
  TALL = 'tall',
}
export const enum WebviewShareButton {
  HIDE = 'hide',
}
export const enum ImageAspectRatio {
  HORIZONTAL = 'horizontal',
  SQUARE = 'square',
}

/** [START] Text */
export interface TextMessage {
  text: string; /** 2000 char limit */
}
/** [END] Text */

/** [START] QuickReplies */
export interface QuickReplyAttachment<T extends {}> {
  type: 'image'|'audio'|'video'|'file'|'template';
  payload: T;
}
export interface QuickReplies {
  content_type: 'text'|'location'|'user_phone_number'|'user_email';

  title?: string; /** Required if content_type=text & 20 char limit */
  payload?: string|number; /** Required if content_type=text & 1000 char limit */
  image_url?: string; /** Minimum 24px x 24px. Larger image will be cropped and resized */
}
export interface QuickReply<T extends {}> {
  text: string;
  quick_replies: QuickReplies[]; /** Up to 11 quick replies */

  attachment?: QuickReplyAttachment<T>;
}
/** [END] QuickReplies */

/** [START] ButtonTemplate */
export interface ButtonTemplateMessagePayload<T> {
  template_type: 'button';
  text: string; /** 640 char limit */
  buttons: T[]; /** 3 btn limit */

  sharable?: boolean; /** Defaults to false */
}
export type ButtonTemplateMessage<T> = BaseTemplate<ButtonTemplateMessagePayload<T>>;
/** [END] ButtonTemplate */

/** [START] GenericTemplate */
export interface GenericTemplateMessagePayloadElements<T> {
  title: string; /** 80 char limit */
  buttons: T[]; /** 3 btn limit */

  subtitle?: string; /** 80 char limit */
  image_url?: string;
  default_action?: DefaultAction;
}
export interface GenericTemplateMessagePayload<T> {
  template_type: 'generic';
  elements: GenericTemplateMessagePayloadElements<T>[]; /** 10 elem limit */

  sharable?: boolean; /** Defaults to false */
  image_aspect_ratio?: 'horizontal'|'square';
}
export type GenericTemplateMessage<T> = BaseTemplate<GenericTemplateMessagePayload<T>>;
/** [END] GenericTemplate */

/** [START] ReceiptTemplate */
export interface ReceiptTemplatePayloadAdjustment {
  name: string;
  amount: number;
}
export interface ReceiptTemplatePayloadAddress {
  street_1: string;
  city: string;
  postal_code: string;
  state: string; /** state abbreviation for U.S., or the region/province for non-U.S. */
  country: string; /** two-letter country abbreviation */

  street_2?: string;
}
export interface ReceiptTemplatePayloadElements {
  title: string; /** 80 char limit */
  price: number; /** For free items, '0' is allowed */

  subtitle?: string; /** 80 char limit */
  quantity?: number;
  currency?: string;
  image_url?: string;
}
export interface ReceiptTemplatePayloadSummary {
  total_cost: number;

  subtotal?: number;
  shipping_cost?: number;
  total_tax?: number;
}
export interface ReceiptTemplatePayload {
  template_type: 'receipt';
  recipient_name: string;
  order_number: string; /** Must be unique */
  currency: string;
  payment_method: string;
  summary: ReceiptTemplatePayloadSummary;

  sharable?: boolean; /** Defaults to false */
  merchant_name?: string; /** If present this is shown as logo text */
  timestamp?: string; /** Timestamp of the order in seconds */
  elements?: ReceiptTemplatePayloadElements[]; /** 100 elem limit */
  address?: ReceiptTemplatePayloadAddress;
  adjustments?: ReceiptTemplatePayloadAdjustment[];
}
export type ReceiptTemplateMessage = BaseTemplate<ReceiptTemplatePayload>;
/** [END] ReceiptTemplate */

export interface DefaultAction {
  type: 'web_url';
  url: string;

  webview_height_ratio?: 'full'|'compact'|'tall'; /** Defaults to full. */
  messenger_extensions?: boolean;
  fallback_url?: string; /** Required if messenger_extensions is set */
  webview_share_button?: 'hide';
}
export interface PostbackButton {
  type: 'postback';
  title: string; /** 20 char limit */
  payload: string; /** 1000 char limit */
}
export  interface URLButton extends DefaultAction {
  title: string; /** 20 char limit */
}
export interface MessengerId {
  id: string;
}
export interface SendAsReturnError {
  message: string;
  type: string;
  code: number;
  error_subcode: number;
  fbtrace_id: string;
}
export interface SendAsData {
  recipient_id: string;
  message_id: string;
}

declare interface BaseParams {
  url: string;
  recipient: MessengerId;

  notificationType?: 'NO_PUSH'|'REGULAR'|'SILENT_PUSH';
  typingDelay?: number;
  options?: RequestInit;
}
declare interface SendAsParams<T extends {}> extends BaseParams {
  message: T;
}
declare type SendAsReadReceiptParams = Pick<BaseParams, 'url'|'recipient'|'options'>;
declare interface SendAsTypingBubbleParams extends SendAsReadReceiptParams {
  showTyping: boolean;
}
declare interface BaseTemplate<T> {
  attachment: {
    type: 'template';
    payload: T;
  };
}

import { RequestInit } from 'node-fetch';

import { fetchAsJson } from 'fetch-as';

async function preSendFn<T = {}, U = SendAsReturnError>({
  url,
  options,
}: Pick<BaseParams, 'url'|'options'>) {
  const d = await fetchAsJson<T, U>(url, {
    method: 'POST',
    compress: true,
    timeout: 599e3,
    headers: {
      'content-type': 'application/json',
    },
    /**
     * NOTE:
     * When using sender_action,
     * recipient should be the only other property set in the request.
     * {@link http://bit.do/eu6np|Send API - Messenger Platform}
     */
    ...options, /** Hardly null */
  });

  if (d.status > 399) {
    throw d.error;
  }

  return d.data!;
}

function preSend(url: string, recipient: MessengerId, cb: (...args: any[]) => any) {
  if (typeof url !== 'string' || !url.length) {
    throw new TypeError(`Expected 'url' to be a valid URL, but received '${url}'`);
  }

  const rid = recipient && recipient.id;

  if (recipient == null || (typeof rid !== 'string' || !rid.length)) {
    throw new TypeError(`Expected 'recipient' to have a valid ID, but received '${
      JSON.stringify(recipient)}'`);
  }

  return cb && cb();
}

export async function sendAs<T = {}>({
  url,
  recipient,
  message,

  notificationType,
  options,
  typingDelay,
}: SendAsParams<T>) {
  return preSend(url, recipient, async () => {
    try {
      if (message == null) {
        throw new TypeError(`Expected 'message' to be defined, but received '${
          JSON.stringify(message)}'`);
      }

      /** NOTE: Always display typing bubble first */
      await sendAsTypingBubble({ url, recipient, options, showTyping: true });
      await new Promise(yay => setTimeout(yay, typingDelay == null ? 5e2 : +typingDelay));

      const d = await preSendFn<SendAsData, SendAsReturnError>({
        url,
        options: {
          compress: true,
          timeout: 599e3,
          body: JSON.stringify({
            recipient,
            message,
            messaging_type: 'RESPONSE',
            notification_type: notificationType == null
              ? NotificationType.NO_PUSH
              : notificationType,
          }),
        },
      });

      /** NOTE: Turn typing indicator off */
      await sendAsTypingBubble({ url, recipient, options, showTyping: false });

      return d;
    } catch (e) {
      throw e;
    }
  });
}
export async function sendAsText(args: SendAsParams<TextMessage>) { return sendAs(args); }
export async function sendAsQuickReply<T>(args: SendAsParams<QuickReply<T>>) {
  return sendAs(args);
}
export async function sendAsButtonTemplate<T = {}>(args: SendAsParams<ButtonTemplateMessage<T>>) {
  return sendAs(args);
}
export async function sendAsGenericTemplate<T = {}>(args: SendAsParams<GenericTemplateMessage<T>>) {
  return sendAs(args);
}
export async function sendAsReceiptTemplate(args: SendAsParams<ReceiptTemplateMessage>) {
  return sendAs(args);
}
export async function sendAsReadReceipt({
  url,
  recipient,

  options,
}: SendAsReadReceiptParams) {
  return preSend(url, recipient, async () => preSendFn({
    url,
    options: {
      ...(options == null ? {} : options),
      body: JSON.stringify({ recipient, sender_action: 'mark_seen' }),
    },
  }));
}
export async function sendAsTypingBubble({
  url,
  recipient,
  showTyping,

  options,
}: SendAsTypingBubbleParams) {
  return preSend(url, recipient, async () => {
    if (typeof showTyping !== 'boolean') {
      throw new TypeError(
        `Expected 'showTyping' to be of type 'boolean', but received '${showTyping}'`);
    }

    return preSendFn({
      url,
      options: {
        ...(options == null ? {} : options),
        body: JSON.stringify({
          recipient,
          sender_action: showTyping ? 'typing_on' : 'typing_off',
        }),
      },
    });
  });
}

export default sendAs;
