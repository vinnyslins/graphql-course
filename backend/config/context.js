const mockUsuarioLogado = require('./mock-usuario-logado')

module.exports = async ({ req }) => {
  await mockUsuarioLogado(req)

  const auth = req.headers.authorization
  console.log(auth)
}
