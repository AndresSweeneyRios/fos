import Vue from 'vue'
import Vuex from 'vuex'
import db from 'localforage'

import {
  GenerateRSAKeypair, 
  ExportRSAKey,
  RSA,
  RawRSA,
} from './rsa'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    aes: null,
    rsa: {
      private: null,
      public: null,
    },
  },

  mutations: {
    set (state, payload): void {
      Object.assign(state, payload)
    },
  },

  actions: {
    async CryptoSetup ({ commit }): Promise<void> {
      const encodedRSAPrivateKey: string = await db.getItem('rsa_private_key')
      const encodedRSAPublicKey: string = await db.getItem('rsa_public_key')

      if (encodedRSAPrivateKey && encodedRSAPublicKey) {
        const rsa = {
          private: await RSA(encodedRSAPrivateKey, true),
          public: await RSA(encodedRSAPublicKey, false),
        }

        commit('set', { rsa })
      } else {
        const {
          privateKey, publicKey, 
        } = await GenerateRSAKeypair()

        await db.setItem('rsa_public_key', await ExportRSAKey(publicKey))
        await db.setItem('rsa_private_key', await ExportRSAKey(privateKey))

        const rsa = {
          private: await RawRSA(privateKey, true),
          public: await RawRSA(publicKey, false),
        }

        commit('set', { rsa })
      }
    },
  },
})
