import Command from '../../helpers/Command';
import { config } from '../../main';

class ToggleNotifRole extends Command {
  constructor() {
    super('Toggle role notification');
    this.aliases = ['toggle-notif-role', 'togglenotifrole', 'toggle_notif_role'];
    this.usage = 'toggle-notif-role';
    this.examples = ['toggle-notif-role'];
    this.enabledInHelpChannels = false;
  }

  async execute(message, _args) {
    message.delete();
    const rolename = config.miscellaneous.notifRoleName;
    const role = message.guild.roles.cache.find(r => r.name === rolename);
    if (!role) {
      console.error('Le rôle "Notification Évènement" n\'existe pas !');
      return message.channel.send("Désolé, mais ce rôle n'a pas été créé. Signalez cela à un modérateur discord");
    }

    if (!message.member.roles.cache.has(role.id)) {
      await message.member.roles.add(role);
      message.member.send(`**(${message.guild.name})** Le rôle *"${rolename}"* vous a été ajouté !`);
    } else if (message.member.roles.cache.has(role.id)) {
      await message.member.roles.remove(role);
      message.member.send(`**(${message.guild.name})** Le rôle *"${rolename}"* vous a été enlevé !`);
    }
  }
}

export default ToggleNotifRole;
