import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import Command from '../../structures/Command';

class ServerInfo extends Command {
  constructor() {
    super('Server Info');
    this.aliases = ['serverinfo', 'server_info', 'server-info', 'serveurinfo', 'serveur_info', 'serveur-info'];
    this.usage = 'serveur-info <IP>';
    this.examples = ['serveur-info hypixel.net'];
  }

  async execute(client, message, args) {
    if (args.length === 0) return message.channel.sendError(this.config.invalidCmd, message.member);

    const msg = await message.channel.send(this.config.searching);
    const data = await axios(`${client.config.apis.server}${args[0]}`)
      .then(async (response) => {
        if (response.status !== 200) {
          client.logger.error(`[HTTP request failed] Error : ${response.status}`);
          return message.channel.sendError(`Une erreur est survenue lors de la reqûete... Veuillez réessayer plus tard.\nStatus de la requête : ${response.status}`, message.member);
        }
        return response.data;
      }).catch(console.error);

    if (!data) return message.channel.sendError(this.config.noServerFound, message.member);
    return this.sendDetails(client, message, msg, data, args[0]);
  }

  sendDetails(client, message, msg, data, ip) {
    const embed = new MessageEmbed()
      .setColor(client.config.colors.default)
      .attachFiles([client.config.bot.avatar])
      .setAuthor(`Informations sur ${ip}`, 'attachment://logo.png')
      .setFooter(`Exécuté par ${message.author.username} | Données fournies par https://api.mcsrvstat.us/`)
      .setTimestamp();

    if (typeof data.online !== 'undefined') embed.addField(this.config.embed.status, (data.online ? 'En ligne' : 'Hors ligne'), true);
    if (data.ip) embed.addField(this.config.embed.ip, `\`${data.ip}${data.port ? `:${data.port}` : ''}\``, true);
    if (data.players) embed.addField(this.config.embed.players, `${data.players.online}/${data.players.max}`, true);
    if (data.version) embed.addField(this.config.embed.version, data.version, true);
    if (data.hostname) embed.addField(this.config.embed.hostname, data.hostname, true);
    if (data.software) embed.addField(this.config.embed.software, data.software, true);
    if (data.plugins) embed.addField(this.config.embed.plugins, data.plugin.raw.length, true);
    if (data.mods) embed.addField(this.config.embed.mods, data.mods.raw.length, true);

    msg.delete();
    message.channel.send(embed);
  }
}

export default ServerInfo;
