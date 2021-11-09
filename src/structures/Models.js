const { Schema, model } = require("mongoose");

const guildSchema = Schema({
  id: String,
  prefix: { type: String, default: '?' },
  welcomeChannelId: { type: String, default: '' }
});

module.exports = {
  GuildModel: model('Guild', guildSchema)
}