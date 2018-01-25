// @ts-check

export declare interface SendAsReceiptTemplateMessagePayloadElements {
  title: string; /** 80 char limit */
  subtitle?: string; /** 80 char limit */
  quantity?: number;
  price: number; /** For free items, '0' is allowed */
  currency?: string;
  image_url?: string;
}
export declare interface SendAsReceiptTemplateMessagePayloadAddress {
  street_1: string;
  street_2?: string;
  city: string;
  postal_code: string;
  state: string; /** state abbreviation for U.S., or the region/province for non-U.S. */
  country: string; /** two-letter country abbreviation */
}
export declare interface SendAsReceiptTemplateMessagePayloadSummary {
  subtotal?: number;
  shipping_cost?: number;
  total_tax?: number;
  total_cost: number;
}
export declare interface SendAsReceiptTemplateMessagePayloadAdjustment {
  name: string;
  amount: number;
}
export declare interface SendAsReceiptTemplateMessagePayload {
  template_type: 'receipt';
  shareable?: boolean; /** Defaults to false */
  recipient_name: string;
  merchant_name?: string; /** If present this is shown as logo text */
  order_number: string; /** Must be unique */
  currency: string;
  payment_method: string;
  timestamp?: number; /** Timestamp of the order in seconds */
  elements: SendAsReceiptTemplateMessagePayloadElements[]; /** 100 elem limit */
  address?: SendAsReceiptTemplateMessagePayloadAddress;
  summary: SendAsReceiptTemplateMessagePayloadSummary;
  adjustments?: SendAsReceiptTemplateMessagePayloadAdjustment[];
}
export declare interface SendAsReceiptTemplateMessage {
  attachment: {
    type: 'template',
    payload: SendAsReceiptTemplateMessagePayload;
  };
}
export declare interface SendAsReceiptTemplateParams {
  url: string;
  recipient: FbEventRecipient;
  message: SendAsReceiptTemplateMessage;
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

export async function sendAsReceiptTemplate({
  url,
  recipient,
  message,
  notificationType,
  typingDelay,
  options = {},
}: SendAsReceiptTemplateParams) {
  return sendAs({
    url,
    recipient,
    message,
    notificationType,
    typingDelay,
    options,
  });
}

export default sendAsReceiptTemplate;
