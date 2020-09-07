const bcrypt = require('bcrypt-nodejs')

const db = require('../../config/db')
const { perfil: obterPerfil } = require('../Query/perfil')
const { usuario: obterUsuario } = require('../Query/usuario')

const mutations = {
  async registrarUsuario (_, { dados }) {
    return mutations.novoUsuario(_, { dados })
  },

  async novoUsuario (_, { dados: { perfis: filtroPerfis, ...dados } }, ctx) {
    ctx && ctx.validarAdmin()

    const salt = bcrypt.genSaltSync()
    dados.senha = bcrypt.hashSync(dados.senha, salt)

    const [id] = await db('usuarios').insert(dados)

    if (!filtroPerfis || !filtroPerfis.length) {
      filtroPerfis = [{
        nome: 'comum'
      }]
    }

    const perfis = await Promise.all(
      filtroPerfis.map(filtro => obterPerfil(_, { filtro }))
    )

    await Promise.all(
      perfis
        .filter(perfil => perfil)
        .map(perfil => db('usuarios_perfis').insert({
          usuario_id: id,
          perfil_id: perfil.id
        }))
    )

    return db('usuarios').where({ id }).first()
  },

  async excluirUsuario (_, args, ctx) {
    ctx && ctx.validarAdmin()

    const usuario = await obterUsuario(_, args)
    if (!usuario) throw new Error('Usuário não encontrado.')

    await db('usuarios_perfis').where({ usuario_id: usuario.id }).delete()
    await db('usuarios').where({ id: usuario.id }).delete()

    return usuario
  },

  async alterarUsuario (_, { filtro, dados: { perfis: filtroPerfis, ...dados } }, ctx) {
    ctx && ctx.validarUsuarioFiltro(filtro)

    const usuario = await obterUsuario(_, { filtro })
    if (!usuario) throw new Error('Usuário não encontrado.')

    if (ctx.isAdmin && filtroPerfis) {
      await db('usuarios_perfis').where({ usuario_id: usuario.id }).delete()

      if (filtroPerfis.length) {
        const perfis = await Promise.all(
          filtroPerfis.map(filtroPerfil => obterPerfil(_, { filtro: filtroPerfil }))
        )

        await Promise.all(
          perfis
            .filter(perfil => perfil)
            .map(perfil => db('usuarios_perfis').insert({
              usuario_id: usuario.id,
              perfil_id: perfil.id
            }))
        )
      }
    }

    if (dados.senha) {
      const salt = bcrypt.genSaltSync()
      dados.senha = bcrypt.hashSync(dados.senha, salt)
    }

    await db('usuarios').where({ id: usuario.id }).update(dados)
    return { ...usuario, ...dados }
  }
}

module.exports = mutations
