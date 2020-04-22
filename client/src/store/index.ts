import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import db from 'localforage'

import {
  GenerateRSAKeypair, 
  ExportRSAKey,
  RSA,
  RawRSA,
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
      const encodedRSAPrivateKey = await db.getItem('rsa_private_key')
      const encodedRSAPublicKey = await db.getItem('rsa_public_key')

      if (encodedRSAPrivateKey && encodedRSAPublicKey) {
        const rsa = {
          private: await RSA(encodedRSAPrivateKey as string, { isPrivate: true }),
          public: await RSA(encodedRSAPublicKey as string),
        }

        commit('set', { rsa })
      } else {
        const {
          privateKey, publicKey, 
        } = await GenerateRSAKeypair()

        await db.setItem('rsa_public_key', await ExportRSAKey(publicKey))
        await db.setItem('rsa_private_key', await ExportRSAKey(privateKey))

        const rsa = {
          private: await RawRSA(privateKey, { isPrivate: true }),
          public: await RawRSA(publicKey),
        }

        commit('set', { rsa })
      }
    },
  },
})
