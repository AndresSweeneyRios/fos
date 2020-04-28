const ALGORITHM = 'RSA-OAEP'
const HASH = 'SHA-256'

import { RSA as RSAInterface } from '@interfaces'

const decode = (
  buffer: ArrayBuffer,
): string => String.fromCharCode(
  ...new Uint8Array(buffer),
)

const encode = (
  string: string,
): ArrayBuffer => Uint8Array.from(
  [...string].map(char => char.charCodeAt(0)), // TODO: verify working with `0` argument
).buffer

export const GenerateRSAKeypair = async (
  length = 1024,
): Promise<CryptoKeyPair> => {
  return await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      modulusLength: length,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: HASH,
    },
    true,
    ["encrypt", "decrypt"],
  )
}

export const ImportRSAKey = async ( 
  encodedKey: string, 
  extractable = false, 
  usages: Array<string>,
): Promise<CryptoKey> => {
  return await crypto.subtle.importKey(
    'jwk', 
    JSON.parse(atob(encodedKey)), 
    {
      name: ALGORITHM,
      hash: HASH, 
    }, 
    extractable, 
    usages,
  )
}

export const ExportRSAKey = async (
  key: CryptoKey,
): Promise<string> => {
  return btoa(JSON.stringify(
    await crypto.subtle.exportKey('jwk', key),
  ))
}

export const RawRSA = async (
  key: CryptoKey, 
  isPrivate: boolean,
): Promise<RSAInterface> => ({
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
): Promise<RSAInterface> => {
  const key = await ImportRSAKey(
    encodedKey, 
    !isPrivate, 
    isPrivate ? ['decrypt'] : ['encrypt'],
  )

  return await RawRSA(key, isPrivate)
}
