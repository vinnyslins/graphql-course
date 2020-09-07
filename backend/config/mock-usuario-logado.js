const db = require('./db')
const { getUsuarioLogado } = require('../resolvers/Common/usuario')

const getUsuario = async perfilId => {
  const usuario = await db('usuarios')
    .join('usuarios_perfis', 'usuarios.id', 'usuarios_perfis.usuario_id')
    .where({ 'usuarios_perfis.perfil_id': perfilId })
    .first()

  return usuario
}

module.exports = async req => {
  const usuario = await getUsuario(2)
  if (usuario) {
    const { token } = await getUsuarioLogado(usuario)
    req.headers.authorization = `Bearer ${token}`
  }
}
