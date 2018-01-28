// @ts-check

export declare interface NockyParams {
  url: string;
  apiVersion: string;
}
export declare interface Config {
  fbGraphApiUrl: string;
  fbPageAccesToken: string;
  testReceipientId: string;
}

/** Import project dependencies */
import { randomBytes } from 'crypto';
import idx from 'idx';
import isUrl from 'is-url-superb';
import nock from 'nock';

/** Import other modules */
import * as expected from './expected';

/** Setting up */
export const TEST_URL = process.env.TEST_URL || 'http://localhost:4343';
export const TEST_API_VERSION = process.env.TEST_API_VERSION || 'v2.11';

async function randomi(byteSize?: number) {
  return new Promise<string>((yay, nah) => {
    randomBytes(byteSize || 256, (err, buf) => {
      if (err) {
        nah(err);
      }

      return yay(buf.toString('base64'));
    });
  });
}

export async function nocky({
  url,
  apiVersion,
}: NockyParams) {
  try {
    if (typeof url !== 'string' || !url.length) {
      throw new TypeError('url is missing');
    }

    nock(url)
      .persist()
      .post(`/${apiVersion}/me/messages/error`)
      .reply((_, reqBody) => {

        const {
          sender_action,
        } = reqBody;

        if (/^(mark_seen|typing)/i.test(sender_action)) {
          return [500, {
            ...expected.missingSenderAction,
          }];
        }

        return [500, {
          error: {
            message: `No match for error ${JSON.stringify(reqBody)}`,
          },
        }];
      });

    nock(url)
      .persist()
      .post(`/${apiVersion}/me/messages`)
      .reply((__, reqBody) => {
        const {
          sender_action,
          recipient,
          message,
        } = reqBody;
        const recipientId = idx(recipient, _ => _.id) || 'no-recipient-id';
        const messageKeys = Object.keys(message || {});

        switch (true) {
          case /^typing/i.test(sender_action): {
            return [200, { recipient_id: recipientId }];
          }
          case /^mark_seen/i.test(sender_action): {
            return [200, {
              ...expected.successMessageId,
              recipient_id: recipientId,
            }];
          }
          case messageKeys.includes('attachment'): {
            switch (true) {
              case idx(message, _ => _.attachment) == null: {
                return [400, { ...expected.emptyMessage }];
              }
              case idx(message, _ => _.attachment.type) == null: {
                return [400, { ...expected.missingMessageAttachmentType }];
              }
              case idx(message, _ => _.attachment.payload) == null: {
                return [400, { ...expected.missingMessageAttachmentPayload }];
              }
              case idx(message, _ => _.attachment.payload.template_type) == null: {
                return [400, { ...expected.invalidTemplateType }];
              }
              case idx(message, _ => _.attachment.payload.template_type) === 'button': {
                const attachmentPayload = idx(message, _ => _.attachment.payload);

                if (
                  typeof attachmentPayload.text !== 'string'
                    || !attachmentPayload.template_type.length
                ) {
                  return [400, { ...expected.buttonTemplate.missingNamePlaceholderText }];
                }

                if (attachmentPayload.buttons == null) {
                  return [400, { ...expected.buttonTemplate.missingNamePlaceholderButtons }];
                }

                if (!idx(message, _ => _.attachment.payload.buttons.length)) {
                  return [400, { ...expected.buttonTemplate.emptyNamePlaceHolderButtons }];
                }

                const btns = idx(message, _ => _.attachment.payload.buttons);
                const btnType = idx(btns, _ => _[0].type);

                if (btnType == null) {
                  return [400, {
                    ...expected.buttonTemplate.missingNamePlaceholderButtonsButtonType,
                  }];
                }

                /** NOTE: Postback buttons */
                if (btnType === 'postback') {
                  const btnsBtnTitle = idx(btns, _ => _[0].title);

                  if (btnsBtnTitle == null) {
                    return [400, {
                      ...expected.buttonTemplate.missingNamePlaceholderButtonsButtonTitle,
                    }];
                  }

                  if (typeof btnsBtnTitle !== 'string' || !btnsBtnTitle.length) {
                    return [400, {
                      ...expected.buttonTemplate.emptyNamePlaceholderButtonsButtonTitle,
                    }];
                  }

                  const btnsBtnPayload = idx(btns, _ => _[0].payload);

                  if (typeof btnsBtnPayload !== 'string' || !btnsBtnPayload.length) {
                    return [400, {
                      ...expected.buttonTemplate.missingPostbackTypeButtonPayload,
                    }];
                  }

                  return [200, {
                    ...expected.successMessageId,
                    recipient_id: recipientId,
                  }];
                }

                /** NOTE: URL buttons */
                if (btnType === 'web_url') {
                  const btnUrl = idx(btns, _ => _[0].url);

                  if (typeof btnUrl !== 'string' || !btnUrl.length) {
                    return [400, { ...expected.buttonTemplate.missingUrlTypeButtonUrl }];
                  }

                  return isUrl(btnUrl)
                    ? [
                      200, {
                        ...expected.successMessageId,
                        recipient_id: recipientId,
                      },
                    ]
                    : [400, { ...expected.buttonTemplate.invalidUrlButtonsUrl }];
                }
              }
              case idx(message, _ => _.attachment.payload.template_type) === 'generic': {
                const payloadElems = idx(message, _ => _.attachment.payload.elements);

                if (payloadElems == null) {
                  return [200, {
                    ...expected.successMessageId,
                    recipient_id: recipientId,
                  }];
                }

                if (!Array.isArray(payloadElems) || !payloadElems.length) {
                  return [400, {
                    ...expected.genericTemplate.namePlaceholderElementsTooFewElements,
                  }];
                }

                const payloadElemsElemTitle = idx(payloadElems, _ => _[0].title);

                if (payloadElemsElemTitle == null && idx(payloadElems, _ => _[0].buttons) == null) {
                  return [400, {
                    ...expected.genericTemplate.incompleteElementData,
                  }];
                }

                if ((typeof payloadElemsElemTitle !== 'string' || !payloadElemsElemTitle.length)) {
                  return [400, {
                    ...expected.genericTemplate.emptyNamePlaceholderElementsElementTitle,
                  }];
                }

                if (!idx(payloadElems, _ => _[0].buttons.length)) {
                  return [400, {
                    ...expected.genericTemplate.namePlaceholderElementsElementButtonsTooFewElements,
                  }];
                }

                return [200, {
                  ...expected.successMessageId,
                  recipient_id: recipientId,
                }];
              }
              case idx(message, _ => _.attachment.payload.template_type) === 'receipt': {
                const attachmentPayload = idx(message, _ => _.attachment.payload);

                if (idx(attachmentPayload, _ => _.recipient_name) == null) {
                  return [400, {
                    ...expected.receiptTemplate.missingNamePlaceholderRecipientName,
                  }];
                }

                if (idx(attachmentPayload, _ => _.order_number) == null) {
                  return [400, {
                    ...expected.receiptTemplate.missingNamePlaceholderOrderNumber,
                  }];
                }

                if (idx(attachmentPayload, _ => _.currency) == null) {
                  return [400, {
                    ...expected.receiptTemplate.missingNamePlaceholderCurrency,
                  }];
                }

                /** NOTE: Simple test against 'usd', 'USD' is supported */
                if (/^usd/.test(idx(attachmentPayload, _ => _.currency))) {
                  return [400, {
                    ...expected.receiptTemplate.currencyCodeNotSupported,
                  }];
                }

                if (idx(attachmentPayload, _ => _.payment_method) == null) {
                  return [400, {
                    ...expected.receiptTemplate.missingNamePlaceholderPaymentMethod,
                  }];
                }

                if (idx(attachmentPayload, _ => _.summary) == null) {
                  return [400, {
                    ...expected.receiptTemplate.missingNamePlaceholderSummary,
                  }];
                }

                const summaryTotalCost = idx(attachmentPayload, _ => _.summary.total_cost);

                /**
                 * NOTE: Simple test on summary[total_cost]
                 * - Must not be a string or empty string value
                 * - Must not have decimals greater than 2 for USD.
                 */
                if (
                  (typeof summaryTotalCost === 'string' && summaryTotalCost.length > 0)
                    || `${summaryTotalCost}`.replace(/\d+(?:\.(\d+))/i, '$1').length > 2
                ) {
                  return [400, {
                    ...expected.receiptTemplate.invalidPaymentSummary,
                  }];
                }

                return [200, {
                  ...expected.successMessageId,
                  recipient_id: recipientId,
                }];
              }
              default: {
                return [500, {
                  error: {
                    message: `No match for attachment ${JSON.stringify(reqBody)}`,
                  },
                }];
              }
            }
          }
          case messageKeys.includes('quick_replies'): {
            const messageText = idx(message, _ => _.text);

            if (typeof messageText !== 'string' || !messageText.length) {
              return [400, {
                ...expected.emptyMessage,
              }];
            }

            if (!idx(message, _ => _.quick_replies.length)) {
              return [400, {
                ...expected.quickReplies.messageQuickRepliesTooFewElements,
              }];
            }

            const messageQuickRepliesQuickReply = idx(message, _ => _.quick_replies[0]);

            if (idx(messageQuickRepliesQuickReply, _ => _.content_type) == null) {
              return [400, {
                ...expected.quickReplies.missingMessageQuickRepliesQuickReplyContentType,
              }];
            }

            if (idx(messageQuickRepliesQuickReply, _ => _.title) == null) {
              return [400, {
                ...expected.quickReplies.missingMessageQuickRepliesQuickReplyTitle,
              }];
            }

            if (idx(messageQuickRepliesQuickReply, _ => _.payload) == null) {
              return [400, {
                ...expected.quickReplies.missingMessageQuickRepliesQuickReplyPayload,
              }];
            }

            return [200, {
              ...expected.successMessageId,
              recipient_id: recipientId,
            }];
          }
          case messageKeys.includes('text'): {
            const messageText = idx(message, _ => _.text);

            if (typeof messageText !== 'string' || !messageText.length) {
              return [400, {
                ...expected.emptyMessage,
              }];
            }

            return [200, {
              ...expected.successMessageId,
              recipient_id: recipientId,
            }];
          }
          default: {
            return [500, {
              error: {
                message: `No match for ${JSON.stringify(reqBody)}`,
              },
            }];
          }
        }
      });
  } catch (e) {
    throw e;
  }
}

export async function killNocky() {
  try {
    return await nock.cleanAll();
  } catch (e) {
    throw e;
  }
}

export const config = async function runConfig(): Promise<Config> {
  try {
    return {
      fbGraphApiUrl: `${TEST_URL}/${TEST_API_VERSION}/me/messages`,
      fbPageAccesToken: await randomi(),
      testReceipientId: await randomi(),
    };
  } catch (e) {
    throw e;
  }
};

export default config;
