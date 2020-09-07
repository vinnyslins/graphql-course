const jwt = require('jwt-simple')

const { perfis: obterPerfis } = require('../Type/Usuario')

module.exports = {
  async getUsuarioLogado (usuario) {
    const perfis = await obterPerfis(usuario)
    const now = Math.floor(Date.now() / 1000)

    const usuarioInfo = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfis: perfis.map(perfil => perfil.nome),
      iat: now,
      exp: now + (3 * 24 * 3600)
    }

    return {
      ...usuarioInfo,
      token: jwt.encode(usuarioInfo, process.env.JWT_KEY)
    }
  }
}
