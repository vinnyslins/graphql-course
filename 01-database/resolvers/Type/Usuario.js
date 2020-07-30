const db = require('../../config/db')

module.exports = {
  async perfis(usuario) {
    const perfis = await db('usuarios_perfis')
      .where({ usuario_id: usuario.id })
      .join('perfis', 'perfis.id', 'usuarios_perfis.perfil_id')
      .select('perfis.id', 'perfis.nome', 'perfis.rotulo')

    return perfis
  }
}
