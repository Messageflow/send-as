// @ts-check

export declare interface FbEventRecipient {
  id: string;
}
export interface PostbackButton {
  type: 'postback';
  title: string; /** 20 char limit */
  payload: string; /** 1000 char limit */
}
export interface URLButton {
  type: 'web_url';
  title: string; /** 20 char limit */
  url: string;
  webview_height_ratio?: 'full' | 'compact' | 'tall';
  messenger_extensions?: boolean;
  fallback_url?: string; /** Required if messenger_extensions is set */
  webview_share_button?: 'hide';
}

/** Import other modules */
export * from './send-as-button-template';
export * from './send-as-generic-template';
export * from './send-as-quick-reply';
export * from './send-as-read-receipt';
export * from './send-as-receipt-template';
export * from './send-as-text';
export * from './send-as-typing-bubble';
