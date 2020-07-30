const db = require('../../config/db')

module.exports = {
  async usuarios() {
    return db('usuarios')
  },
  async usuario(_, { filtro }) {
    const { id, email } = filtro
    if (id) return db('usuarios').where({ id }).first()
    return db('usuarios').where('email', 'like', `%${email}%`).first()
  }
}
