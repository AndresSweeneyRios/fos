const ALGORITHM = 'RSA-OAEP'
const HASH = 'SHA-256'

import RSA from '@interfaces/RSA'

const decode = (buffer: ArrayBuffer) => String.fromCharCode(
  ...new Uint8Array(buffer),
)

const encode = (string: string) => Uint8Array.from(
  [...string].map(char => char.charCodeAt(0)), // TODO: verify working with `0` argument
).buffer

export const GenerateRSAKeypair = (length = 1024) => crypto.subtle.generateKey(
  {
    name: ALGORITHM,
    modulusLength: length,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: HASH,
  },
  true,
  ["encrypt", "decrypt"],
)

export const ImportRSAKey = ( 
  encodedKey: string, 
  extractable = false, 
  usages: Array<string>,
): PromiseLike<CryptoKey> => (
  crypto.subtle.importKey(
    'jwk', 
    JSON.parse(atob(encodedKey)), 
    {
      name: ALGORITHM,
      hash: HASH, 
    }, 
    extractable, 
    usages,
  )
)

export const ExportRSAKey = async (key: CryptoKey): Promise<string> => (
  btoa(JSON.stringify(
    await crypto.subtle.exportKey('jwk', key),
  ))
)

export const RawRSA = async (
  key: CryptoKey, 
  isPrivate: boolean,
): Promise<RSA> => ({
  encrypt: async (data: string): Promise<string> => decode(
    await crypto.subtle.encrypt(ALGORITHM, key, encode(data)),
  ),

  decrypt: async (data: string): Promise<string> => decode(
    await crypto.subtle.decrypt(ALGORITHM, key, encode(data)),
  ),

  key: isPrivate ? null : await ExportRSAKey(key),
})

export const RSA = async (
  encodedKey: string, 
  isPrivate: boolean,
): Promise<RSA> => {
  const key = await ImportRSAKey(
    encodedKey, 
    !isPrivate, 
    isPrivate ? ['decrypt'] : ['encrypt'],
  )

  return await RawRSA(key, isPrivate)
}
