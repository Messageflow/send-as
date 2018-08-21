// @ts-check

type SendAsReadReceiptParams = Pick<BaseParams, 'url'|'recipient'|'options'>;

export interface ReadReceiptReturnType extends FetchAsReturnType {
  data?: RecipientId;
  error?: SendAsReturnError;
}

import { BaseParams, RecipientId, SendAsReturnError } from './';

import { fetchAsJson, FetchAsReturnType } from 'fetch-as';

export async function sendAsReadReceipt({
  url,
  recipient,
  options,
}: SendAsReadReceiptParams): Promise<RecipientId> {
  try {
    const d = await fetchAsJson<ReadReceiptReturnType>(url, {
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
      body: JSON.stringify({ recipient, sender_action: 'mark_seen' }),
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

export default sendAsReadReceipt;
