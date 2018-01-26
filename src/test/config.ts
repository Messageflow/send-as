// @ts-check

export declare interface NockyParams {
  url: string;
  apiVersion: string;
  pageAccessToken: string;
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
  pageAccessToken,
}: NockyParams) {
  try {
    if (typeof url !== 'string' || !url.length) {
      throw new TypeError('url is missing');
    }

    nock(url)
      .persist()
      .post(`/${apiVersion}/me/messages`)
      .reply((uri, reqBody) => {
        console.log('#nock-post', uri, JSON.stringify(reqBody, null, 2));

        const {
          sender_action,
          recipient,
          message,
        } = reqBody;
        const recipientId = idx(recipient, _ => _.id) || 'no-recipient-id';

        if (/^typing/i.test(sender_action)) {
          console.log('#nock-typing');
          return [200, { recipient_id: recipientId }];
        }

        switch (true) {
          case message.attachment == null: {
            return [400, { ...expected.missingMessage }];
          }
          case idx(message, _ => _.attachment.type) == null: {
            return [400, { ...expected.missingMessageAttachmentType }];
          }
          case idx(message, _ => _.attachment.payload) == null: {
            return [400, { ...expected.missingMessageAttachmentPayload }];
          }
          case idx(message, _ => _.attachment.payload.buttons) != null: {
            if (!idx(message, _ => _.attachment.payload.buttons.length)) {
              return [400, { ...expected.missingNamePlaceholderButtons }];
            }

            const btns = idx(message, _ => _.attachment.payload.buttons);

            if (idx(btns, _ => _[0].title) == null) {
              return [400, { ...expected.missingElementButtonTitle }];
            }

            /** NOTE: Postback buttons */
            const btnType = idx(btns, _ => _[0].type);

            if (btnType === 'postback') {
              const btnPayload = idx(btns, _ => _[0].payload);

              return typeof btnPayload === 'string' && btnPayload.length > 0
                ? [
                  200, {
                    ...expected.successMessageId,
                    recipient_id: recipientId,
                  },
                ]
                : [400, { ...expected.missingPostbackTypeButtonPayload }];
            }

            /** NOTE: URL buttons */
            if (btnType === 'web_url') {
              const btnUrl = idx(btns, _ => _[0].url);

              if (btnUrl == null) {
                return [400, { ...expected.missingUrlTypeButtonUrl }];
              }

              return isUrl(btnUrl)
                ? [
                  200, {
                    ...expected.successMessageId,
                    recipient_id: recipientId,
                  },
                ]
                : [400, { ...expected.invalidUrlButtonsUrl }];
            }
          }
          default: {
            console.log('#nock-default');

            return [
              500,
              {
                error: {
                  message: `No match for ${JSON.stringify(reqBody)}`,
                },
              },
            ];
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
