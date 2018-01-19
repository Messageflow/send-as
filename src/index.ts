// @ts-check

export declare interface FbEventRecipient {
  id: string;
}
export interface URLButton {
  type: string | 'web_url';
  title: string; /** 20 char limit */
  url: string;
  webview_height_ratio?: string | 'full' | 'compact' | 'tall';
  messenger_extensions?: boolean;
  fallback_url?: string; /** Required if messenger_extensions is set */
  webview_share_button?: string | 'hide';
}
export interface PostbackButton {
  type: string | 'postback';
  title: string; /** 20 char limit */
  payload: string; /** 1000 char limit */
}

/** Import other modules */
export * from './send-as-button-template';
