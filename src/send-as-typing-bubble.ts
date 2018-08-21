// @ts-check

declare interface SendAsTypingBubbleParams extends Pick<BaseParams, 'url'|'recipient'|'options'> {
  showTyping?: boolean;
}
declare type TypingBubbleReturnType = ReadReceiptReturnType;

import { BaseParams, RecipientId } from '.';

import { fetchAsJson } from 'fetch-as';
import { ReadReceiptReturnType } from './send-as-read-receipt';

export async function sendAsTypingBubble({
  url,
  recipient,
  options,
  showTyping = true,
}: SendAsTypingBubbleParams): Promise<RecipientId> {
  try {
    const d = await fetchAsJson<TypingBubbleReturnType>(url, {
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
      body: JSON.stringify({
        recipient,
        sender_action: showTyping ? 'typing_on' : 'typing_off',
      }),
      ...(options == null ? {} : options),
    });

    if (d.status > 399) {
      throw d.error;
    }

    return d.data!;
  } catch (e) {
    throw e;
  }
}

export default sendAsTypingBubble;
