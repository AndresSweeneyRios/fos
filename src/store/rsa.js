const ALGORITHM = 'RSA-OAEP'
const HASH = 'SHA-256'

const decode = buffer => String.fromCharCode(
    ...new Uint8Array(buffer)
)

const encode = string => Uint8Array.from(
    [...string].map(char => char.charCodeAt())
).buffer

export const GenerateRSAKeypair = (length = 1024) => crypto.subtle.generateKey(
    {
        name: ALGORITHM,
        modulusLength: length,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: HASH
    },
    true,
    ["encrypt", "decrypt"]
)

export const ImportRSAKey = ( 
    key, 
    extractable = false, 
    usages,
) => crypto.subtle.importKey(
    'jwk', 
    JSON.parse(atob(key)), 
    { name: ALGORITHM, hash: HASH, }, 
    extractable, 
    usages
)

export const ExportRSAKey = async key => btoa(JSON.stringify(
    await crypto.subtle.exportKey( 'jwk', key )
))

export const RawRSA = async ( key, { isPrivate } = {} ) => ({
    encrypt: async data => decode(
        await crypto.subtle.encrypt(ALGORITHM, key, encode(data))
    ),

    decrypt: async data => decode(
        await crypto.subtle.decrypt(ALGORITHM, key, encode(data))
    ),

    key: isPrivate ? null : await ExportRSAKey(key)
})

export const RSA = async ( encoded_key, { isPrivate } = {} ) => {
    const key = await ImportRSAKey(
        encoded_key, 
        !isPrivate, 
        isPrivate ? ['decrypt'] : ['encrypt']
    )

    return await RawRSA( key, { isPrivate } )
}