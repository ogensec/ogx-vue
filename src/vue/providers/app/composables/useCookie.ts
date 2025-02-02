//Extracted and edited from nuxt3
import type { Ref } from 'vue';
import {  ref, watch } from 'vue';
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie-es';
import { parse, serialize } from 'cookie-es';

type _CookieOptions = Omit<CookieSerializeOptions & CookieParseOptions, 'decode' | 'encode'>;

export interface CookieOptions<T = any> extends _CookieOptions {
  decode?(value: string): T;
  encode?(value: T): string;
  default?: () => T | Ref<T>;
  watch?: boolean | 'shallow';
  readonly?: boolean;
}

export interface CookieRef<T> extends Ref<T> {}

const CookieDefaults = {
  path: '/',
  watch: true,
  decode: (val: string) => {
    try {
      return JSON.parse(decodeURIComponent(val));
    } catch {
      return decodeURIComponent(val);
    }
  },
  encode: (val: any) => encodeURIComponent(typeof val === 'string' ? val : JSON.stringify(val)),
} satisfies CookieOptions<any>;

export default function useCookie<T = string | null | undefined>(
  name: string,
  _opts?: CookieOptions<T>
): CookieRef<T> {
  const opts = { ...CookieDefaults, ..._opts };
  const cookies = readRawCookies(opts) || {};

  let delay: number | undefined;
  if (opts.maxAge !== undefined) {
    delay = opts.maxAge * 1000; // convert to ms for setTimeout
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }

  const hasExpired = delay !== undefined && delay <= 0;
  const cookieValue = hasExpired ? undefined : cookies[name] ?? opts.default?.();
  const cookie = ref<T | undefined>(cookieValue as any);

    const callback = () => {
      if (opts.readonly || cookie.value === cookies[name]) return;
      writeClientCookie(name, cookie.value, opts as CookieSerializeOptions);
      cookies[name] = cookie.value;
    };

    if (opts.watch) {
      watch(cookie, callback, { deep: opts.watch !== 'shallow' });
    } else {
      callback();
    }

  return cookie as CookieRef<T>;
}

function readRawCookies(opts: CookieOptions = {}): Record<string, unknown> | undefined {
    return parse(document.cookie, opts);
}

function serializeCookie(name: string, value: any, opts: CookieSerializeOptions = {}) {
  if (value === null || value === undefined) {
    return serialize(name, '', { ...opts, maxAge: -1 });
  }
  return serialize(name, value, opts);
}

function writeClientCookie(name: string, value: any, opts: CookieSerializeOptions = {}) {
    document.cookie = serializeCookie(name, value, opts);
}
