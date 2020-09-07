const jwt = require('jwt-simple')

const mockUsuarioLogado = require('./mock-usuario-logado')

module.exports = async ({ req }) => {
  await mockUsuarioLogado(req)

  const { authorization } = req.headers
  const token = authorization && authorization.substring(7)

  let usuario = null
  let isAdmin = false

  if (token) {
    try {
      const payload = jwt.decode(token, process.env.JWT_KEY)

      if (payload && new Date(payload.exp * 1000) > new Date()) {
        usuario = payload
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
    },
    validarUsuarioFiltro (filtro) {
      if (isAdmin) return
      if (!usuario || !filtro) throw err

      const { id, email } = filtro

      if (!id && !email) throw err
      if (id && id !== usuario.id) throw err
      if (email !== usuario.email) throw err
    }
  }
}
