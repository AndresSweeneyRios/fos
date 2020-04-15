const ALGORITHM = 'RSA-OAEP'
const HASH = 'SHA-256'

export const GenerateRSAKeypair = async () => {
    let rsa = await crypto.subtle.generateKey(
        {
            name: ALGORITHM,
            modulusLength: 1024,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: HASH
        },
        true,
        ["encrypt", "decrypt"]
    );


    console.log('RSA Keypair generated')

    return rsa
}

export const ImportRSAKeypair = async ( encoded_rsa_keypair ) => {
    const rsa_keypair = JSON.parse(atob(encoded_rsa_keypair))

    const publicKey = await crypto.subtle.importKey(
        'jwk', 
        rsa_keypair.publicKey, 
        { name: ALGORITHM, hash: HASH }, 
        true, 
        ['encrypt'] 
    )

    const privateKey = await crypto.subtle.importKey(
        'jwk', 
        rsa_keypair.privateKey, 
        { name: ALGORITHM, hash: HASH }, 
        true, 
        ['decrypt'] 
    )

    console.log('RSA Keypair imported')

    return { publicKey, privateKey }
}

export const ExportRSAKeypair = async ( decoded_rsa_keypair ) => {
    const publicKey = await crypto.subtle.exportKey(
        'jwk', 
        decoded_rsa_keypair.publicKey
    )

    const privateKey = await crypto.subtle.exportKey(
        'jwk', 
        decoded_rsa_keypair.privateKey
    )

    return btoa(JSON.stringify({ publicKey, privateKey }))
}

export const RSAKeyConnector = ( key ) => {
    var decode = buffer => String.fromCharCode(
        ...new Uint8Array(buffer)
    )

    var encode = string => Uint8Array.from(
        [...string].map(char => char.charCodeAt())
    ).buffer

    return {
        encrypt: async data => decode(
            await crypto.subtle.encrypt(ALGORITHM, key, encode(data))
        ),

        decrypt: async data => decode(
            await crypto.subtle.decrypt(ALGORITHM, key, encode(data))
        ),
    }
}