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

        if (/^typing/i.test(sender_action)) {
          console.log('#nock-typing');

          return [
            200,
            {
              recipient_id: (recipient && recipient.id) || 'no-recipient-id',
            },
          ];
        }

        switch (true) {
          case message.attachment == null: {
            return [
              400,
              { ...expected.missingMessage },
            ];
          }
          case message.attachment && message.attachment.type == null: {
            return [
              400,
              { ...expected.missingMessageAttachmentType },
            ];
          }
          case message.attachment && message.attachment.payload == null: {
            return [
              400,
              { ...expected.missingMessageAttachmentPayload },
            ];
          }
          case message.attachment.payload
            && message.attachment.payload
            && message.attachment.payload.buttons != null: {
              if (!(message.attachment.payload.buttons).length) {
                return [
                  400,
                  { ...expected.missingNamePlaceholderButtons },
                ];
              }

              if (
                message.attachment.payload.buttons[0]
                  && message.attachment.payload.buttons[0].title == null
              ) {
                return [
                  400,
                  { ...expected.missingElementButtonTitle },
                ];
              }

              if (
                message.attachment.payload.buttons[0]
                  && (
                    message.attachment.payload.buttons[0].type
                      && message.attachment.payload.buttons[0].type === 'postback'
                  )
                  && message.attachment.payload.buttons[0].payload == null
              ) {
                return [
                  400,
                  { ...expected.missingPostbackTypeButtonPayload },
                ];
              }

              if (
                message.attachment.payload.buttons[0]
                  && (
                    message.attachment.payload.buttons[0].type
                      && message.attachment.payload.buttons[0].type === 'web_url'
                  )
                  && message.attachment.payload.buttons[0].url == null
              ) {
                return [
                  400,
                  { ...expected.missingUrlTypeButtonUrl },
                ];
              }
            }
          default: {
            console.log('#nock-default');

            return [
              200,
              {
                status: 200,
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
