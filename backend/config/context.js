const jwt = require('jwt-simple')

const mockUsuarioLogado = require('./mock-usuario-logado')

module.exports = async ({ req }) => {
  await mockUsuarioLogado(req)

  const { authorization } = req.headers
  const [, token] = authorization.split(' ')

  let usuario = null
  let isAdmin = false

  if (!token) {
    try {
      const payload = jwt.decode(token, process.env.JWT_KEY)

      if (payload) {
        if (new Date(usuario.exp * 1000) > new Date()) {
          usuario = payload
        }
      }
    } catch {
    }
  }

  if (usuario && usuario.perfis) {
    isAdmin = usuario.perfis.some(perfil => perfil.nome === 'admin')
  }

  const err = new Error('Acesso negado')

  return {
    usuario,
    isAdmin,
    validarUsuario () {
      if (!usuario) throw err
    },
    validarAdmin () {
      if (!isAdmin) throw err
    }
  }
}
