const crypto = require('crypto');

/**
 * @see {@link https://stackoverflow.com/a/72219174}
 */
let cryptoPatched = false;
const monkeyPathCrypto = () => {
  if (cryptoPatched) return;
  cryptoPatched = true;

  /**
   * The MD4 algorithm is not available anymore in Node.js 17+ (because of library SSL 3).
   * In that case, silently replace MD4 by the MD5 algorithm.
   */
  try {
    crypto.createHash('md4');
  } catch (e) {
    console.warn('Crypto "MD4" is not supported anymore by this Node.js version');
    const origCreateHash = crypto.createHash;
    crypto.createHash = (alg, opts) => {
      return origCreateHash(alg === 'md4' ? 'md5' : alg, opts);
    };
  }
};

monkeyPathCrypto();
