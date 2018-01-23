// @ts-check

export declare interface FbEventRecipient {
  id: string;
}
export interface PostbackButton {
  type: string | 'postback';
  title: string; /** 20 char limit */
  payload: string; /** 1000 char limit */
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

/** Import other modules */
export * from './send-as-button-template';
export * from './send-as-generic-template';
export * from './send-as-quick-reply';
export * from './send-as-read-receipt';
export * from './send-as-receipt-template';
export * from './send-as-text';
export * from './send-as-typing-bubble';
