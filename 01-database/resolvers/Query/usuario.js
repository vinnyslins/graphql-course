const db = require('../../config/db')

module.exports = {
  async usuarios() {
    return db('usuarios')
  },
  async usuario(_, { filtro }) {
    const { id, email } = filtro
    const filter = id ? { id } : { email }
    return db('usuarios').where(filter).first()
  }
}
