export const emptyMessage = {
  error: {
    message: '(#100) Message cannot be empty, must provide valid attachment or text',
    type: 'OAuthException',
    code: 100,
    error_subcode: 2018034,
    fbtrace_id: 'GPNXcUzHc1O',
  },
};
export const missingMessageAttachmentType = {
  error: {
    message: '(#100) The parameter message[attachment][type] is required',
    type: 'OAuthException',
    code: 100,
    fbtrace_id: 'ALEZf96rVRb',
  },
};
export const missingMessageAttachmentPayload = {
  error: {
    message: '(#100) The parameter message[attachment][payload] is required',
    type: 'OAuthException',
    code: 100,
    fbtrace_id: 'HHaqOMzJs3U',
  },
};
export const invalidTemplateType = {
  error: {
    message: '(#100) Invalid template type',
    type: 'OAuthException',
    code: 100,
    fbtrace_id: 'DAuV7UrcjbM',
  },
};

export const buttonTemplate = {
  // missingMessage: {
  //   error: {
  //     message: '(#100) Must send either message or state',
  //     type: 'OAuthException',
  //     code: 100,
  //     error_subcode: 2018015,
  //     fbtrace_id: 'HHvxmizabwF',
  //   },
  // },
  missingNamePlaceholderText: {
    error: {
      message: '(#100) The parameter name_placeholder[text] is required',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'EzFV\/xREKx8',
    },
  },
  missingNamePlaceholderButtons: {
    error: {
      message: '(#100) The parameter name_placeholder[buttons] is required',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'G+8N30bMMV7',
    },
  },
  emptyNamePlaceHolderButtons: {
    error: {
      message: '(#100) param name_placeholder[buttons] must be non-empty.',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'E4CDWR\/RZRN',
    },
  },
  missingNamePlaceholderButtonsButtonType: {
    error: {
      message: '(#100) The parameter name_placeholder[buttons][0][type] is required',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'CHTapDY84cG',
    },
  },
  missingNamePlaceholderButtonsButtonTitle: {
    error: {
      message: '(#100) Element button title cannot be empty.',
      type: 'OAuthException',
      code: 100,
      error_subcode: 2018053,
      fbtrace_id: 'AlDhNRTY1sB',
    },
  },
  emptyNamePlaceholderButtonsButtonTitle: {
    error: {
      // tslint:disable-next-line:max-line-length
      message: '(#100) Param name_placeholder[buttons][0][title] must be a non-empty UTF-8 encoded string',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'HY0JyWNF52M',
    },
  },
  missingPostbackTypeButtonPayload: {
    error: {
      message: '(#100) Payload cannot be empty for postback type button',
      type: 'OAuthException',
      code: 100,
      error_subcode: 2018040,
      fbtrace_id: 'DK9BAW3hjFl',
    },
  },
  missingUrlTypeButtonUrl: {
    error: {
      message: '(#100) Web url cannot be empty for url type button',
      type: 'OAuthException',
      code: 100,
      error_subcode: 2018041,
      fbtrace_id: 'EPmARGhfUm+',
    },
  },
  invalidUrlButtonsUrl: {
    error: {
      message: '(#100) name_placeholder[buttons][0][url] should represent a valid URL',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'FeFimzNw6fV',
    },
  },
};
export const genericTemplate = {
  namePlaceholderElementsTooFewElements: {
    error: {
      message: '(#194) param name_placeholder[elements] has too few elements.',
      type: 'OAuthException',
      code: 194,
      fbtrace_id: 'BYQMctPg7lp',
    },
  },
  incompleteElementData: {
    error: {
      // tslint:disable-next-line:max-line-length
      message: '(#100) Incomplete element data: title and at least one other field (image url, subtitle or buttons) is required with non-empty value',
      type: 'OAuthException',
      code: 100,
      error_subcode: 2018035,
      fbtrace_id: 'EwGMGolrpP2',
    },
  },
  emptyNamePlaceholderElementsElementTitle: {
    error: {
      // tslint:disable-next-line:max-line-length
      message: '(#100) Param name_placeholder[elements][0][title] must be a non-empty UTF-8 encoded string',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'GQbY8uOnAF7',
    },
  },
  namePlaceholderElementsElementButtonsTooFewElements: {
    error: {
      message: '(#194) param name_placeholder[elements][0][buttons] has too few elements.',
      type: 'OAuthException',
      code: 194,
      fbtrace_id: 'G638dBi1xya',
    },
  },
};
export const quickReplies = {
  messageQuickRepliesTooFewElements: {
    error: {
      message: '(#194) param message[quick_replies] has too few elements.',
      type: 'OAuthException',
      code: 194,
      fbtrace_id: 'EvpmJgtAPRS',
    },
  },
  missingMessageQuickRepliesQuickReplyContentType: {
    error: {
      message: '(#100) The parameter message[quick_replies][0][content_type] is required',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'ARC0xqnQX02',
    },
  },
  missingMessageQuickRepliesQuickReplyTitle: {
    error: {
      message: '(#100) Title is required for this quick reply content type',
      type: 'OAuthException',
      code: 100,
      error_subcode: 2018098,
      fbtrace_id: 'APjGBdksgV8',
    },
  },
  missingMessageQuickRepliesQuickReplyPayload: {
    error: {
      message: '(#100) Payload is required for this quick reply content type',
      type: 'OAuthException',
      code: 100,
      error_subcode: 2018099,
      fbtrace_id: 'CyUZcTpUUuT',
    },
  },
};
export const receiptTemplate = {
  missingNamePlaceholderRecipientName: {
    error: {
      message: '(#100) The parameter name_placeholder[recipient_name] is required',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'D+KXhualr49',
    },
  },
  missingNamePlaceholderOrderNumber: {
    error: {
      message: '(#100) The parameter name_placeholder[order_number] is required',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'GP6kXn99i1X',
    },
  },
  missingNamePlaceholderCurrency: {
    error: {
      message: '(#100) The parameter name_placeholder[currency] is required',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'Co8TjqYo\/EH',
    },
  },
  currencyCodeNotSupported: {
    error: {
      message: '(#100) The currency code \'usd\' is not supported',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'GdRUiZPiL+Q',
    },
  },
  missingNamePlaceholderPaymentMethod: {
    error: {
      message: '(#100) The parameter name_placeholder[payment_method] is required',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'D+ktiCibYZ7',
    },
  },
  missingNamePlaceholderSummary: {
    error: {
      message: '(#100) The parameter name_placeholder[summary] is required',
      type: 'OAuthException',
      code: 100,
      fbtrace_id: 'GIg1iEFAd0Q',
    },
  },
  invalidPaymentSummary: {
    error: {
      // tslint:disable-next-line:max-line-length
      message: '(#100) The amount you specified in payment summary is invalid. Please verify that it is a valid positive amount and is supported by its currency in terms of decimal places.',
      type: 'OAuthException',
      code: 100,
      error_subcode: 2018055,
      fbtrace_id: 'DRUZe3U2w1c',
    },
  },
};

export const missingSenderAction = {
  error: {
    message: '(#100) Must send either message or state',
    type: 'OAuthException',
    code: 100,
    error_subcode: 2018015,
    fbtrace_id: 'HZIJL0CsFGS',
  },
};
export const successMessageId = {
  message_id: 'mid.$cAaIwD89I0sNnyYILOvHmdZcTp7vX',
};
