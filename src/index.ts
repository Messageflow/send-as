// @ts-check

export type ContentType = 'text'|'location';
export type AttachmentType = 'image'|'audio'|'video'|'file'|'template';
export type NotificationType = 'NO_PUSH'|'REGULAR'|'SILENT_PUSH';
export type WebviewHeightRatio = 'full'|'compact'|'tall';
export type WebviewShareButton = 'hide';
export type ImageAspectRatio = 'horizontal'|'square';

/** [START] Text */
export interface TextMessage {
  text: string; /** 2000 char limit */
}
/** [END] Text */

/** [START] QuickReplies */
export interface QuickReplyAttachment<T extends {}> {
  type: AttachmentType;
  payload: T;
}
export interface QuickReplies {
  content_type: ContentType;

  title?: string; /** Required if content_type=text & 20 char limit */
  payload?: string|number; /** Required if content_type=text & 1000 char limit */
  image_url?: string; /** Minimum 24px x 24px. Larger image will be cropped and resized */
}
export interface QuickReply<T extends {}> {
  text: string;
  attachment?: QuickReplyAttachment<T>;
  quick_replies: QuickReplies[]; /** Up to 11 quick replies */
}
/** [END] QuickReplies */

/** [START] ButtonTemplate */
export interface ButtonTemplateMessagePayload {
  template_type: 'button';
  text: string; /** 20000 char limit */
  buttons: (URLButton | PostbackButton)[]; /** 3 btn limit */
}
export interface ButtonTemplateMessage {
  attachment: {
    type: 'template';
    payload: ButtonTemplateMessagePayload;
  };
}
/** [END] ButtonTemplate */

/** [START] GenericTemplate */
export interface GenericTemplateMessagePayloadElements {
  title: string; /** 80 char limit */
  subtitle?: string; /** 80 char limit */
  image_url?: string;
  default_action?: DefaultAction;
  buttons: (URLButton | PostbackButton)[]; /** 3 btn limit */
}
export interface GenericTemplateMessagePayload {
  template_type: 'generic';
  sharable?: boolean; /** Defaults to false */
  image_aspect_ratio?: ImageAspectRatio;
  elements: GenericTemplateMessagePayloadElements[]; /** 10 elem limit */
}
export interface GenericTemplateMessage {
  attachment: {
    type: 'template',
    payload: GenericTemplateMessagePayload;
  };
}
/** [END] GenericTemplate */

/** [START] ReceiptTemplate */
export interface ReceiptTemplatePayloadElements {
  title: string; /** 80 char limit */
  subtitle?: string; /** 80 char limit */
  quantity?: number;
  price: number; /** For free items, '0' is allowed */
  currency?: string;
  image_url?: string;
}
export interface ReceiptTemplatePayloadAddress {
  street_1: string;
  street_2?: string;
  city: string;
  postal_code: string;
  state: string; /** state abbreviation for U.S., or the region/province for non-U.S. */
  country: string; /** two-letter country abbreviation */
}
export interface ReceiptTemplatePayloadSummary {
  subtotal?: number;
  shipping_cost?: number;
  total_tax?: number;
  total_cost: number;
}
export interface ReceiptTemplatePayloadAdjustment {
  name: string;
  amount: number;
}
export interface ReceiptTemplatePayload {
  template_type: 'receipt';
  sharable?: boolean; /** Defaults to false */
  recipient_name: string;
  merchant_name?: string; /** If present this is shown as logo text */
  order_number: string; /** Must be unique */
  currency: string;
  payment_method: string;
  timestamp?: number; /** Timestamp of the order in seconds */
  elements?: ReceiptTemplatePayloadElements[]; /** 100 elem limit */
  address?: ReceiptTemplatePayloadAddress;
  summary: ReceiptTemplatePayloadSummary;
  adjustments?: ReceiptTemplatePayloadAdjustment[];
}
export interface ReceiptTemplateMessage {
  attachment: {
    type: 'template',
    payload: ReceiptTemplatePayload;
  };
}
/** [END] ReceiptTemplate */

export interface DefaultAction {
  type: 'web_url';
  url: string;

  webview_height_ratio?: WebviewHeightRatio;
  messenger_extensions?: boolean;
  fallback_url?: string; /** Required if messenger_extensions is set */
  webview_share_button?: WebviewShareButton;
}
export interface MessengerId {
  id: string;
}

export interface PostbackButton {
  type: 'postback';
  title: string; /** 20 char limit */
  payload: string; /** 1000 char limit */
}
export interface URLButton extends DefaultAction {
  title: string; /** 20 char limit */
}

export interface BaseParams {
  url: string;
  recipient: MessengerId;

  notificationType?: NotificationType;
  typingDelay?: number;
  options?: RequestInit;
}
export interface SendAsReturnError {
  message: string;
  type: string;
  code: number;
  error_subcode: number;
  fbtrace_id: string;
}
declare interface SendAsParams<T extends {}> extends BaseParams {
  message: T;
}

import { FetchAsReturnType } from 'fetch-as';
import { RequestInit } from 'node-fetch';

import { fetchAsJson } from 'fetch-as';

import sendAsTypingBubble from './send-as-typing-bubble';

export async function runAfter(after?: number) {
  return new Promise(yay => setTimeout(yay, after == null ? 5e2 : +after));
}

export interface RecipientId {
  recipient_id: string;
}
declare interface SendAsData extends RecipientId {
  message_id: string;
}
declare interface SendAsReturnType extends FetchAsReturnType {
  data?: SendAsData;
  error?: SendAsReturnError;
}

export async function sendAs<T extends {}>({
  url,
  recipient,
  message,

  notificationType,
  typingDelay,
  options,
}: SendAsParams<T>): Promise<SendAsReturnType> {
  try {
    if (typeof url !== 'string' || !url.length) {
      throw new TypeError(`Expected 'url' to be a valid URL, but received '${url}'`);
    }

    const recipientId = recipient && recipient.id;

    if (recipient == null || (typeof recipientId !== 'string' || !recipientId.length)) {
      throw new TypeError(
        `Expected 'recipient' to be defined with a valid ID, but received '${recipientId}'`);
    }

    if (message == null) {
      throw new TypeError(
        `Expected 'message' to be defined, but received '${JSON.stringify(message)}'`);
    }

    /** NOTE: Always display typing bubble first */
    await sendAsTypingBubble({ url, recipient, options, showTyping: true });
    await runAfter(typingDelay);

    const d = await fetchAsJson<SendAsReturnType>(url, {
      method: 'POST',
      compress: true,
      timeout: 599e3,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        recipient,
        message,
        messaging_type: 'RESPONSE',
        notification_type: notificationType || 'NO_PUSH',
      }),
      ...(options == null ? {} : options),
    });

    /** NOTE: Turn typing indicator off */
    await sendAsTypingBubble({ url, recipient, options, showTyping: false });

    return d;
  } catch (e) {
    throw e;
  }
}

export async function sendAsText(args: SendAsParams<TextMessage>) { return sendAs(args); }
export async function sendAsQuickReply<T>(args: SendAsParams<QuickReply<T>>) {
  return sendAs(args);
}
export async function sendAsButtonTemplate(args: SendAsParams<ButtonTemplateMessage>) {
  return sendAs(args);
}
export async function sendAsGenericTemplate(args: SendAsParams<GenericTemplateMessage>) {
  return sendAs(args);
}
export async function sendAsReceiptTemplate(args: SendAsParams<ReceiptTemplateMessage>) {
  return sendAs(args);
}

export * from './send-as-read-receipt';
export * from './send-as-typing-bubble';

export default sendAs;
