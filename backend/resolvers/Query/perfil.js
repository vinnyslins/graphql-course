const db = require('../../config/db')

module.exports = {
  async perfis () {
    return db('perfis')
  },
  async perfil (_, { filtro }) {
    const { id, nome } = filtro
    const filter = id ? { id } : { nome }
    return db('perfis').where(filter).first()
  }
}
