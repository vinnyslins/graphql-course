const bcrypt = require('bcrypt-nodejs')

const db = require('../../config/db')
const { getUsuarioLogado } = require('../Common/usuario')

module.exports = {
  async login (_, { dados }) {
    const usuario = await db('usuarios').where({ email: dados.email }).first()

    if (!usuario || !bcrypt.compareSync(dados.senha, usuario.senha)) {
      throw new Error('E-mail ou senha incorretos')
    }

    return getUsuarioLogado(usuario)
  },
  async usuarios () {
    return db('usuarios')
  },
  async usuario (_, { filtro }) {
    const { id, email } = filtro
    const filter = id ? { id } : { email }
    return db('usuarios').where(filter).first()
  }
}
