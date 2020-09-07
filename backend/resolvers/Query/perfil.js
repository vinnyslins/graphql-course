const db = require('../../config/db')

module.exports = {
  async perfis (parent, args, ctx) {
    ctx && ctx.validarAdmin()

    return db('perfis')
  },
  async perfil (_, { filtro }, ctx) {
    ctx && ctx.validarAdmin()

    const { id, nome } = filtro
    const filter = id ? { id } : { nome }
    return db('perfis').where(filter).first()
  }
}
