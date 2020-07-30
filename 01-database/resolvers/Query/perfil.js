const db = require('../../config/db')

module.exports = {
  async perfis() {
    return db('perfis')
  },
  async perfil(_, { filtro }) {
    const { id, nome } = filtro
    if (id) return db('perfis').where({ id }).first()
    return db('perfis').where('nome', 'like', `%${nome}%`).first()
  }
}
