const { GuildModel } = require("./Models")

class GuildsProvider {
  async get(guild) {
    const data = await GuildModel.findOne({ id: guild.id });
    if (data) return data;
  }

  async update(guild, settings) {
    let data = await this.get(guild);
    if (typeof data !== 'object') data = {}
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key]
    }
    return GuildModel.updateOne({ id: guild.id }, data);
  }
}

module.exports = { GuildsProvider }