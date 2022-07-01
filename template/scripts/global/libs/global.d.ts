declare global {
  const mini: {{#if_eq type "aliapp"}}typeof my{{/if_eq}}{{#if_eq type "weapp"}}WechatMiniprogram.Wx{{/if_eq}};
}

export {};
