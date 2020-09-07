const db = require('../../config/db')
const { perfil: obterPerfil } = require('../Query/perfil')

module.exports = {
  async novoPerfil (_, { dados }) {
    const [id] = await db('perfis').insert(dados)
    return db('perfis').where({ id }).first()
  },
  async excluirPerfil (_, args) {
    const perfil = await obterPerfil(_, args)
    if (!perfil) throw new Error('Perfil não encontrado.')

    await db('usuarios_perfis').where({ perfil_id: perfil.id }).delete()
    await db('perfis').where({ id: perfil.id }).delete()

    return perfil
  },
  async alterarPerfil (_, { filtro, dados }) {
    const perfil = await obterPerfil(_, { filtro })
    if (!perfil) throw new Error('Perfil não encontrado.')

    await db('perfis').where({ id: perfil.id }).update(dados)
    return { ...perfil, ...dados }
  }
}
