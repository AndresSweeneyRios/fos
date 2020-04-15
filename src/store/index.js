import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import db from 'localforage'

import {
    GenerateRSAKeypair, 
    ImportRSAKeypair, 
    ExportRSAKeypair, 
    RSAKeyConnector,
} from './rsa.js'

export default new Vuex.Store({
    state: {
        aes: null,
        rsa: {
            private: null,
            public: null,
        },
    },

    mutations: {
        set (state, payload) {
            Object.assign(state, payload)
        },
    },

    actions: {
        async CryptoSetup ({ commit }) {
            const encoded_rsa_keypair = await db.getItem('rsa_keypair')

            const { privateKey, publicKey } = encoded_rsa_keypair
                ? await ImportRSAKeypair(encoded_rsa_keypair)
                : await GenerateRSAKeypair()

            await db.setItem('rsa_keypair', ExportRSAKeypair({ privateKey, publicKey }))

            const rsa = {
                private: RSAKeyConnector(privateKey),
                public: RSAKeyConnector(publicKey),
            }

            commit('set', { rsa })
        },
    },
})
