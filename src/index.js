const HeroClient = require("./structures/HeroClient");

let client = new HeroClient({ prefix: '?' });

client.start();