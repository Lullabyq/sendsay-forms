import { getHostName } from '../utils';

export class Cookies {
  static get(sKey) {
    if (!sKey) {
      return null;
    }
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            `(?:(?:^|.*;)\\s*${
              encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&')
            }\\s*\\=\\s*([^;]*).*$)|^.*$`,
          ),
          '$1',
        ),
      ) || null
    );
  }

  static set(sKey, sValue, vEnd, sPath = '/', sDomain = getHostName(), bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    let sExpires = '';
    if (vEnd) {
      // eslint-disable-next-line default-case
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity
            ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
            : `; max-age=${vEnd}`;
          break;
        case String:
          sExpires = `; expires=${vEnd}`;
          break;
        case Date:
          sExpires = `; expires=${vEnd.toUTCString()}`;
          break;
      }
    }
    document.cookie = `${encodeURIComponent(sKey)
    }=${
      encodeURIComponent(sValue)
    }${sExpires
    }${sDomain ? `; domain=${sDomain}` : ''
    }${sPath ? `; path=${sPath}` : ''
    }${bSecure ? '; secure' : ''}`;
    return true;
  }

  static remove(sKey, sPath, sDomain) {
    if (!this.has(sKey)) {
      return false;
    }
    document.cookie = `${encodeURIComponent(sKey)
    }=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
      sDomain ? `; domain=${sDomain}` : ''
    }${sPath ? `; path=${sPath}` : ''}`;
    return true;
  }

  static has(sKey) {
    if (!sKey) {
      return false;
    }
    return new RegExp(
      `(?:^|;\\s*)${
        encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&')
      }\\s*\\=`,
    ).test(document.cookie);
  }

  static keys() {
    const aKeys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  }
}
