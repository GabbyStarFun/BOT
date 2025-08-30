// Discord.js v14 bot conversion of your Python bot
const { Client, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, GatewayIntentBits, Partials, Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, ComponentType } = require('discord.js');
const { token } = require('./config.json'); // Place your bot token in config.json

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const managementSessinons = new Map

// Log member join
client.on('guildMemberAdd', async member => {
    const logChannel = member.guild.channels.cache.get('1409842427891814501');
    if (!logChannel) return;
    const embed = new EmbedBuilder()
        .setTitle('<:logo:1409845811109691563> Roehampton Log')
        .setColor(7171437)
        .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' })
        .addFields(
            { name: 'User:', value: member.user.username, inline: false },
            { name: 'Log:', value: `User joined https://discord.com/channels/${member.guild.id}/${member.guild.systemChannelId}`, inline: false }
        );
    await logChannel.send({ embeds: [embed] });
});

// Log voice channel join/leave
client.on('voiceStateUpdate', async (oldState, newState) => {
    const logChannel = newState.guild.channels.cache.get('1409842443142303816');
    if (!logChannel) return;
    const member = newState.member;
    let action = '';
    if (!oldState.channel && newState.channel) {
        action = `joined voice channel: ${newState.channel.name}`;
    } else if (oldState.channel && !newState.channel) {
        action = `left voice channel: ${oldState.channel.name}`;
    } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        action = `moved from ${oldState.channel.name} to ${newState.channel.name}`;
    }
    if (action) {
        const embed = new EmbedBuilder()
            .setTitle('<:logo:1409845811109691563> Roehampton Log')
            .setColor(7171437)
            .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' })
            .addFields(
                { name: 'User:', value: member.user.username, inline: false },
                { name: 'Log:', value: action, inline: false }
            );
        await logChannel.send({ embeds: [embed] });
    }
});

// Log role changes
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const logChannel = newMember.guild.channels.cache.get('1409842435856797726');
    if (!logChannel) return;
    const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));
    if (addedRoles.size > 0 || removedRoles.size > 0) {
        let changes = '';
        if (addedRoles.size > 0) {
            changes += `Added roles: ${addedRoles.map(r => r.name).join(', ')}\n`;
        }
        if (removedRoles.size > 0) {
            changes += `Removed roles: ${removedRoles.map(r => r.name).join(', ')}\n`;
        }
        const embed = new EmbedBuilder()
            .setTitle('<:logo:1409845811109691563> Roehampton Log')
            .setColor(7171437)
            .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' })
            .addFields(
                { name: 'User:', value: newMember.user.username, inline: false },
                { name: 'Log:', value: changes, inline: false }
            );
        await logChannel.send({ embeds: [embed] });
    }
});
// Log moderation actions (kick, ban, timeout, warning)
client.on('guildAuditLogEntryCreate', async (entry, guild) => {
    const logChannel = guild.channels.cache.get('1409842449215655946');
    if (!logChannel) return;
    let action = '';
    if (entry.action === 'MEMBER_KICK') {
        action = `User kicked: <@${entry.target.id}> by <@${entry.executor.id}>`;
    } else if (entry.action === 'MEMBER_BAN_ADD') {
        action = `User banned: <@${entry.target.id}> by <@${entry.executor.id}>`;
    } else if (entry.action === 'MEMBER_UPDATE' && entry.changes.some(c => c.key === 'communication_disabled_until')) {
        action = `User timed out: <@${entry.target.id}> by <@${entry.executor.id}>`;
    } else if (entry.action === 'MEMBER_UPDATE' && entry.changes.some(c => c.key === 'warn')) {
        action = `User warned: <@${entry.target.id}> by <@${entry.executor.id}>`;
    }
    if (action) {
        const embed = new EmbedBuilder()
            .setTitle('<:logo:1409845811109691563> Roehampton Log')
            .setColor(16711680)
            .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' })
            .addFields(
                { name: 'Action:', value: action, inline: false },
                { name: 'Time:', value: `<t:${Math.floor(entry.createdTimestamp / 1000)}:F>`, inline: false }
            );
        await logChannel.send({ embeds: [embed] });
    }
});

const STATUS_MESSAGES = [
    'Command & Control',
    'discord.gg/Pbv4SjJBx4'
];
let statusIndex = 0;

client.once(Events.ClientReady, () => {
    // Send support embed with dropdown in channel 1409842321297772654
    (async () => {
        const channel = await client.channels.fetch('1409842321297772654');
        // Check for existing support embed
        const messages = await channel.messages.fetch({ limit: 20 });
        const alreadyExists = messages.some(msg =>
            msg.embeds.length > 0 &&
            msg.embeds[0].title === '<:logo:1409845811109691563> Roehampton Support' &&
            msg.author && msg.author.id === client.user.id
        );
        if (!alreadyExists) {
            const embed = new EmbedBuilder()
                .setTitle('<:logo:1409845811109691563> Roehampton Support')
                .setDescription('Select one of the categories below to get started.\n\nWhilst we do our best to provide quick support, you may experience delays of up to 72 hours depending on the availability of a member of the team.')
                .setColor(7171437)
                .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' });
            const { StringSelectMenuBuilder } = require('discord.js');
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('support_select')
                .setPlaceholder('Select a category...')
                .addOptions([
                    { label: '📨 General Enquiries', value: 'general', description: 'Contact our Support team.' },
                    { label: '📝 Recruitment & Onboarding Enquiries', value: 'recruitment', description: 'Contact our Recruitment team.' },
                    { label: '⚙️ Development Enquiries', value: 'development', description: 'Contact our Development team.' },
                    { label: '🔑 Management Enquiries', value: 'management', description: 'Contact our Management team.' }
                ]);
            const row = new ActionRowBuilder().addComponents(selectMenu);
            await channel.send({ embeds: [embed], components: [row] });
        }
    })();
    // Register slash commands
    const guildId = '1352367084306305074'; // Replace with your server ID
    const guild = client.guilds.cache.get(guildId);
    if (guild) {
        guild.commands.create({
            name: 'embed',
            description: 'Send a custom embed using JSON',
            options: [
                {
                    name: 'json',
                    description: 'Embed JSON',
                    type: 3, // STRING
                    required: true
                }
            ]
        });
        guild.commands.create({
            name: 'group-prompt',
            description: 'Send group join prompt to a user',
            options: [
                {
                    name: 'user',
                    description: 'User to prompt',
                    type: 6, // USER
                    required: true
                }
            ]
        });
                guild.commands.create({
                        name: 'onboard',
                        description: 'Onboard a new user',
                        options: [
                                { name: 'user', description: 'User to onboard', type: 6, required: true },
                                { name: 'rank', description: 'Rank', type: 3, required: true,
                                    choices: [
                                        { name: 'Cmsr', value: 'Cmsr' },
                                        { name: 'D/Cmsr', value: 'D/Cmsr' },
                                        { name: 'A/Cmsr', value: 'A/Cmsr' },
                                        { name: 'Ad/Cmsr', value: 'Ad/Cmsr' },
                                        { name: 'Cmdr', value: 'Cmdr' },
                                        { name: 'C/Supt', value: 'C/Supt' },
                                        { name: 'Supt', value: 'Supt' },
                                        { name: 'C/Insp', value: 'C/Insp' },
                                        { name: 'Insp', value: 'Insp' },
                                        { name: 'Sgt', value: 'Sgt' },
                                        { name: 'PC', value: 'PC' },
                                        { name: 'CIV', value: 'CIV' },
                                        { name: 'CRO', value: 'CRO' }
                                    ]
                                },
                                { name: 'roblox_id', description: 'Roblox ID', type: 3, required: true },
                                { name: 'roles', description: 'Role mentions', type: 3, required: true },
                                { name: 'age', description: 'Age', type: 3, required: true }
                        ]
                });
        guild.commands.create({
            name: 'close',
            description: 'Close onboarding ticket (removes user and renames channel)',
            options: [
                {
                    name: 'user',
                    description: 'User to remove from the ticket',
                    type: 6, // USER
                    required: false
                }
            ]
        });
    }
// Handle slash commands
client.on(Events.InteractionCreate, async interaction => {
    // /close command for onboarding tickets
    if (interaction.commandName === 'close') {
        const channel = interaction.channel;
        // Only allow in onboarding ticket channels
        if (!channel.name.endsWith('-onboarding')) {
            await interaction.reply({ content: 'This command can only be used in onboarding ticket channels.', flags: 64 });
            return;
        }
        // Get user option or default to ticket opener
        let member;
        const userOption = interaction.options.getUser('user');
        if (userOption) {
            member = interaction.guild.members.cache.get(userOption.id);
        } else {
            const username = channel.name.replace('-onboarding', '');
            member = interaction.guild.members.cache.find(m => m.user.username === username);
        }
        if (member) {
            await channel.permissionOverwrites.edit(member.id, { ViewChannel: false, SendMessages: false }).catch(() => {});
        }
        // Rename channel
        await channel.setName('closed-onboarding').catch(() => {});
        await interaction.reply({ content: `Onboarding ticket closed and user${member ? ` <@${member.id}>` : ''} removed.`, flags: 64 });
    }
    // Restore /group-prompt command
    if (interaction.commandName === 'group-prompt') {
        const user = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
            .setTitle('New Onboard')
            .setDescription("We hope this message finds you well. We are pleased to inform you that your application has been accepted. Before you can be fully onboarded, you are required to join our Roblox group. Once you have done so, kindly reply with `Done` to confirm.\n\nShould you have any questions or require further clarification, please do not hesitate to contact our team. We are here to assist you throughout this process.\n\n**Group:** [Roehampton Group](https://www.roblox.com/communities/372448609/Roehampton-RPC#!/about)")
            .setColor(8421504)
            .setFooter({ text: 'ROEHAMPTON - WHITELISTING', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' });
        await interaction.channel.send({ content: `${user}`, embeds: [embed] });
        await interaction.reply({ content: 'Group prompt sent.', flags: 64 });
        // Listen for 'Done' reply
        const filter = m => m.author.id === user.id && m.content.trim().toLowerCase() === 'done';
        const collector = interaction.channel.createMessageCollector({ filter, time: 600000 });
        collector.on('collect', async m => {
            const confirmEmbed = new EmbedBuilder()
                .setDescription("Great! Thank you for confirming. You will be onboarded shortly, please hang tight as our team finalizes the process. We appreciate your patience and look forward to welcoming you fully into the community.")
                .setColor(8421504)
                .setFooter({ text: 'ROEHAMPTON - WHITELISTING', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' });
            await interaction.channel.send({ content: '<@&1409842228280688640>', embeds: [confirmEmbed] });
            collector.stop();
        });
    }
    // Restore /onboard command with logging and invite
    if (interaction.commandName === 'onboard') {
        const user = interaction.options.getUser('user');
        const rank = interaction.options.getString('rank');
        const robloxId = interaction.options.getString('roblox_id');
        const roles = interaction.options.getString('roles');
        const age = interaction.options.getString('age');
        // Warrant number logic
        const warrantNumber = `267${robloxId.slice(-3)}`;
        // Set nickname
        const member = await interaction.guild.members.fetch(user.id);
        if (member) {
            await member.setNickname(`${rank} ${warrantNumber}`).catch(() => {});
            // Assign roles
            const roleIds = Array.from(roles.matchAll(/<@&(\d+)>/g)).map(r => r[1]);
            for (const rid of roleIds) {
                const role = interaction.guild.roles.cache.get(rid);
                if (role) {
                    await member.roles.add(role).catch(() => {});
                    // Assign MPS Bronze/Silver/Gold based on color
                    if (role.color === 0x4f4a44) { // brown
                        const bronze = interaction.guild.roles.cache.find(r => r.name === 'MPS Bronze');
                        if (bronze) await member.roles.add(bronze).catch(() => {});
                    } else if (role.color === 0x989898) { // silver
                        const silver = interaction.guild.roles.cache.find(r => r.name === 'MPS Silver');
                        if (silver) await member.roles.add(silver).catch(() => {});
                    } else if (role.color === 0x898151) { // gold
                        const gold = interaction.guild.roles.cache.find(r => r.name === 'MPS Gold');
                        if (gold) await member.roles.add(gold).catch(() => {});
                    }
                }
            }
            // Always assign access and metropolitan police service roles
            const accessRole = interaction.guild.roles.cache.find(r => r.name === 'access');
            const mpsRole = interaction.guild.roles.cache.find(r => r.name === 'metropolitan police service');
            if (accessRole) await member.roles.add(accessRole).catch(() => {});
            if (mpsRole) await member.roles.add(mpsRole).catch(() => {});
        }
        // Application update embed
        const embedUpdate = new EmbedBuilder()
            .setTitle('Application Update')
            .setDescription(`We hope this message finds you well. We are pleased to inform you that there has been an update regarding your application. Your attention is now required to proceed further.\n\nShould you have any questions or require further clarification, feel free to reach out to our team. We are here to assist you through this process.\n\n**Warrant Number:** \`${warrantNumber}\`\n**Rank:** \`${rank}\`\n\nThank you for your interest and cooperation. We appreciate your time and look forward to moving ahead with your application.`)
            .setColor(8421504)
            .setFooter({ text: 'ROEHAMPTON - WHITELISTING', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' });
        await interaction.channel.send({ content: `${user} You have been accepted!`, embeds: [embedUpdate] });
        await interaction.reply({ content: 'Onboarding complete.', ephemeral: true });
        // Log embed
        const now = new Date();
        const embedLog = new EmbedBuilder()
            .setTitle('<:logo:1409845811109691563> Roehampton Log')
            .setColor(7171437)
            .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' })
            .addFields(
                { name: 'User:', value: user.username, inline: false },
                { name: 'Log:', value: `Onboarded as ${rank} | Roblox: [${robloxId}](https://www.roblox.com/users/${robloxId}/profile) | Age: ${age} | Warrant: ${warrantNumber}`, inline: false }
            );
        const onboardLogChannel = interaction.guild.channels.cache.get('1409842434875199518');
        if (onboardLogChannel) await onboardLogChannel.send({ embeds: [embedLog] });
        // Create invite in server 1409842902250815521
        try {
            const inviteGuild = client.guilds.cache.get('1409842902250815521');
            if (inviteGuild) {
                const inviteChannel = inviteGuild.systemChannel || inviteGuild.channels.cache.find(ch => ch.type === 0);
                if (inviteChannel) {
                    const invite = await inviteChannel.createInvite({ maxUses: 1, maxAge: 86400, unique: true });
                    await interaction.channel.send({ content: `${invite.url}` });
                }
            }
        } catch (err) {
            await interaction.channel.send({ content: 'Could not create invite.' });
        }
    }
    // Handle support dropdown selection
    if (interaction.isStringSelectMenu && interaction.customId === 'support_select') {
        const section = interaction.values[0];
        const user = interaction.user;
        let sectionName = '';
        let channelName = '';
        let parentId = '';
        let pingRole = '';
        switch (section) {
            case 'general':
                sectionName = '📨 General Enquiries';
                channelName = `general-ticket-${user.username}`;
                parentId = '1409842248031666217';
                pingRole = '1409842226195992606';
                break;
            case 'recruitment':
                sectionName = '🗞️ Recruitment & Onboarding Enquiries';
                channelName = `recruitment-ticket-${user.username}`;
                parentId = '1409842254725513306';
                pingRole = '1409842228280688640';
                break;
            case 'development':
                sectionName = '⚙️ Development Enquiries';
                channelName = `development-ticket-${user.username}`;
                parentId = '1409842248031666217';
                pingRole = '1409842223771816061';
                break;
            case 'management':
                sectionName = '🔑 Management Enquiries';
                channelName = `management-ticket-${user.username}`;
                parentId = '1409842248031666217';
                pingRole = '1409842221947031633';
                break;
        }
        // Limit: Only 1 ticket per user per category
        const guild = interaction.guild;
        const existing = guild.channels.cache.find(ch => ch.parentId === parentId && ch.name === channelName && ch.type === 0);
        if (existing) {
            await interaction.reply({ content: 'You already have an open ticket for this category.', ephemeral: true });
            return;
        }
        const overwrites = [
            { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ];
        const ticketChannel = await guild.channels.create({
            name: channelName,
            type: 0,
            parent: parentId,
            permissionOverwrites: overwrites
        });
        // Send ticket embed with close button and ping role
        const ticketEmbed = new EmbedBuilder()
            .setTitle('<:logo:1409845811109691563> Roehampton Support')
            .setDescription('Thank you for opening a ticket today. Please give me some information on how I can help with you today and I will respond as soon as I possibly can.')
            .setColor(7171437)
            .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' });
        const closeRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close_ticket').setLabel('Close').setStyle(ButtonStyle.Danger).setEmoji('❌')
        );
        await ticketChannel.send({ content: `<@&${pingRole}> ${user}`, embeds: [ticketEmbed], components: [closeRow] });
        await interaction.reply({ content: `Ticket opened in ${ticketChannel}.`, ephemeral: true });
    }
    // Handle close button in ticket channel
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
        await interaction.channel.delete();
    }
    if (interaction.commandName === 'embed') {
        const jsonString = interaction.options.getString('json');
        let data;
        try {
            data = JSON.parse(jsonString);
        } catch (err) {
            await interaction.reply({ content: 'Invalid JSON.', ephemeral: true });
            return;
        }
        // Build embeds
        let embeds = [];
        if (Array.isArray(data.embeds)) {
            embeds = data.embeds.map(e => {
                const embed = new EmbedBuilder();
                if (e.title) embed.setTitle(e.title);
                if (e.description) embed.setDescription(e.description);
                if (e.color) embed.setColor(e.color);
                if (e.footer) embed.setFooter(e.footer);
                if (e.fields && Array.isArray(e.fields)) embed.addFields(...e.fields);
                return embed;
            });
        }
        // Build components (only supports buttons in ActionRow)
        let components = [];
        if (Array.isArray(data.components) && data.components.length > 0) {
            const row = new ActionRowBuilder();
            data.components.forEach(c => {
                if (c.type === 2) { // Button
                    const btn = new ButtonBuilder().setLabel(c.label || 'Button');
                    if (c.url) {
                        btn.setStyle(ButtonStyle.Link).setURL(c.url);
                    } else {
                        btn.setStyle(c.style || ButtonStyle.Secondary);
                        if (c.custom_id) btn.setCustomId(c.custom_id);
                    }
                    row.addComponents(btn);
                }
            });
            components.push(row);
        }
        await interaction.channel.send({
            content: data.content || '',
            embeds,
            components: components.length ? components : undefined
        });
        await interaction.reply({ content: 'Embed sent.', ephemeral: true });
    }
});
    console.log(`Logged in as ${client.user.tag}`);
    setInterval(() => {
        client.user.setActivity(STATUS_MESSAGES[statusIndex], { type: 0 });
        statusIndex = (statusIndex + 1) % STATUS_MESSAGES.length;
    }, 10000);

    // Send onboarding embed with button only if not already present
    (async () => {
        const channel = await client.channels.fetch('1409842296266166282');
        const messages = await channel.messages.fetch({ limit: 20 });
        const alreadyExists = messages.some(msg =>
            msg.embeds.length > 0 &&
            msg.embeds[0].title === '<:logo:1409845811109691563> Roehampton Roleplay' &&
            msg.components.length > 0 &&
            msg.components[0].components.some(c => c.customId === 'get_onboarded')
        );
        if (!alreadyExists) {
            const embed1 = new EmbedBuilder()
                .setTitle('<:logo:1409845811109691563> Roehampton Roleplay')
                .setDescription("**Welcome to Roehampton RPC, where realism and professionalism come together**\n\nWhether you're completely new to roleplay, a seasoned veteran from another server, or an experienced officer looking to transfer your rank, there's a place for you here.\n\nOur community offers three recruitment pathways designed for all backgrounds and experience levels. Step into the world of law enforcement, emergency services, or the criminal underworld and start building your story today.\n\n**Requirements to Join**\n> Must be 13+\n> Must have a working microphone\n> Must follow all server rules and RP standards\n\nFind the recruitment route that fits you best, then follow the steps in each channel to start your application.\n\n**Standard Entries**\n> Standard Entry is always open for Police, Control Room, and Civilian Operations. This route lets you join as a Probationary Constable, where you’ll learn core procedures and complete standardized training.\n\n**Direct Entries**\n> Direct Entry allows experienced role-players to join a division immediately, with tailored training provided to complement their existing skills.\n\n**Force Transfers**\n> This entry method allows members transferring from another server with a solid reputation for quality training and roleplay to join our server while retaining the trainings they previously completed.")
                .setColor(8421504)
                .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' });
            const embed2 = new EmbedBuilder()
                .setTitle('<:logo:1409845811109691563> Roehampton Roleplay')
                .setDescription("**Start Your Application**\n\nThis is where your journey with Roehampton RPC begins. Open a ticket to start your recruitment process, ask questions, and receive guidance on your application.")
                .setColor(8421504)
                .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' });
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('get_onboarded')
                    .setLabel('🗞️ Get Onboarded')
                    .setStyle(ButtonStyle.Primary)
            );
            await channel.send({ embeds: [embed1, embed2], components: [row] });
        }
    })();
});

client.on('messageCreate', async message => {
    if (message.content === '!hello') {
        await message.reply('Hello! I am your friendly Discord bot.');
    }
});

client.on('messageCreate', async message => {
    if (message.content === '!management-application') {
        await message.delete();
        const embed = new EmbedBuilder()
            .setTitle('<:logo:1409845811109691563> Roehampton Management Application')
            .setDescription(
                "**Please answer all questions below:**\n\n" +
                "1. Tell us about your previous experience in management or similar roles.\n" +
                "2. What skills do you have that make you a strong candidate for a Management position?\n" +
                "3. How do you handle high-pressure or stressful situations?\n" +
                "4. Have you ever had to deal with difficult or challenging situations? If so, how did you manage them?\n" +
                "5. Why do you want to join as a member of Management?\n" +
                "6. How do you ensure accuracy and professionalism while logging punishments or passing on information?"
            )
            .setColor(7171437)
            .setFooter({ text: "Roehampton Roleplay - Management Team", iconURL: "https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png" });
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('management_modal').setLabel('Answer Questions').setStyle(ButtonStyle.Primary)
        );
        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId === 'management_modal') {
        const modal = new ModalBuilder()
            .setCustomId(`management_application_modal`)
            .setTitle('Management Application');
        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('q1')
                    .setLabel('Previous management experience')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('q2')
                    .setLabel('Skills for Management')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('q3')
                    .setLabel('Handling high-pressure situations')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('q4')
                    .setLabel('Dealing with challenges')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('q5')
                    .setLabel('Why join Management?')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            )
        );
        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'management_application_modal') {
        const answers = [
            interaction.fields.getTextInputValue('q1'),
            interaction.fields.getTextInputValue('q2'),
            interaction.fields.getTextInputValue('q3'),
            interaction.fields.getTextInputValue('q4'),
            interaction.fields.getTextInputValue('q5')
        ];
        const embed = new EmbedBuilder()
            .setTitle('<:logo:1409845811109691563> Management Application Submitted')
            .setColor(7171437)
            .setFooter({ text: "Roehampton Roleplay - Management Team", iconURL: "https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png" })
            .setDescription(
                `**Previous management experience:**\n${answers[0]}\n\n` +
                `**Skills for Management:**\n${answers[1]}\n\n` +
                `**Handling high-pressure situations:**\n${answers[2]}\n\n` +
                `**Dealing with challenges:**\n${answers[3]}\n\n` +
                `**Why join Management?:**\n${answers[4]}`
            );
        await interaction.reply({ embeds: [embed]});
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'get_onboarded') {
        // Create ticket channel
        const guild = interaction.guild;
        const user = interaction.user;
        const staffRoleIds = ['1409842228280688640', '1409842227064344656'];
        const overwrites = [
            { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ];
        staffRoleIds.forEach(rid => {
            overwrites.push({ id: rid, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
        });
        const ticketChannel = await guild.channels.create({
            name: `${user.username}-onboarding`,
            type: 0,
            parent: '1409842254725513306',
            permissionOverwrites: overwrites
        });
        // Embed for onboarding requirements
        const embedReq = new EmbedBuilder()
            .setTitle('<:logo:1409845811109691563> Roehampton Roleplay')
            .setDescription("**Before we proceed with your onboarding, please read and confirm that you agree to the following requirements:**\n> You will follow all server rules and guidelines at all times.\n> You understand that serious roleplay and professionalism is expected.\n> You will not engage in any toxic or disruptive behaviour.\n> You agree to provide accurate informating during the onboarding process.\n> You acknowledge that failure to comply may results in removal from the community.")
            .setColor(8421504)
            .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' });
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('agree').setLabel('Agree').setStyle(ButtonStyle.Success).setEmoji('✅'),
            new ButtonBuilder().setCustomId('disagree').setLabel('Disagree').setStyle(ButtonStyle.Danger).setEmoji('❌')
        );
        await ticketChannel.send({ content: `${user}`, embeds: [embedReq], components: [row] });
    }
    if (interaction.customId === 'disagree') {
        await interaction.channel.delete();
    }
    if (interaction.customId === 'agree') {
        await interaction.message.delete();
        const embedQuestions = new EmbedBuilder()
            .setTitle('<:logo:1409845811109691563> Roehampton Roleplay')
            .setDescription("**Welcome, and thank you for opening an onboarding ticket!**\nTo help us get you set up and ensure you're a good fit for the community, please take a moment to answer the flowing questions:\n\n**Please respond to the following:**\n> What Entry Route are you looking for?\n> What Position are you looking for?\n> What's your age?\n> Where are you from *country/timezone)?\n> Do you have any prior roleplay experience? If so, where?\n> What kind of roleplay are you most interested in (e.g., civilian, police, etc.)?\n> What do you hope o get out of your time in Roehampton PRC?\n\n**Why we're asking:**\nPlease answer honestly, your response help us tailor your experience and ensure you're joining the right community for your style of roleplay.")
            .setColor(8421504)
            .setFooter({ text: 'Roehampton Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png?ex=68aedcd7&is=68ad8b57&hm=72adbbedaff04360ccd0add098da75e5944a314c3aa2deac8cee1beb5200e2fd&' });
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close').setLabel('Close').setStyle(ButtonStyle.Danger).setEmoji('❌')
        );
        await interaction.channel.send({ embeds: [embedQuestions], components: [row] });
    }
    if (interaction.customId === 'close') {
        await interaction.channel.delete();
    }
});

const PATROL_ROLE_IDS = {
    MPS: "1409843155825725560",
    LAS: "1409843159982280744",
    LFB: "1409843157331349605",
    CIV: "1409843154789597215",
    METCC: "1409843190063698001"
};


// Utility for patrol times
function formatDate(dateStr, timeStr) {
    // dateStr: "26/09/25", timeStr: "18:30"
    const [day, month, year] = dateStr.split('/');
    const jsYear = year.length === 2 ? '20' + year : year;
    // London time offset (BST: +1, GMT: +0)
    // For simplicity, always use +1 (BST). For winter, change to +0.
    const dateObj = new Date(`${jsYear}-${month}-${day}T${timeStr}:00+01:00`);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
        display: `${days[dateObj.getDay()]} ${day} ${months[dateObj.getMonth()]} ${timeStr}`,
        iso: dateObj.toISOString()
    };
}

let patrolData = {
    attending: [],
    notAttending: [],
    bookingsClosed: false,
    start: { display: "Fri 26 Sep 18:30", iso: new Date().toISOString() },
    end: { display: "Fri 26 Sep 20:00", iso: new Date().toISOString() },
    close: { display: "Fri 26 Sep 20:00", iso: new Date().toISOString() }
};

function buildPatrolEmbed(guild) {
    let mpsCount = patrolData.attending.filter(id => {
        const member = guild.members.cache.get(id);
        return member && member.roles.cache.has(PATROL_ROLE_IDS.MPS);
    }).length;
    let lasCount = patrolData.attending.filter(id => {
        const member = guild.members.cache.get(id);
        return member && member.roles.cache.has(PATROL_ROLE_IDS.LAS);
    }).length;
    let lfbCount = patrolData.attending.filter(id => {
        const member = guild.members.cache.get(id);
        return member && member.roles.cache.has(PATROL_ROLE_IDS.LFB);
    }).length;
    let civCount = patrolData.attending.filter(id => {
        const member = guild.members.cache.get(id);
        return member && member.roles.cache.has(PATROL_ROLE_IDS.CIV);
    }).length;
    let metccCount = patrolData.attending.filter(id => {
        const member = guild.members.cache.get(id);
        return member && member.roles.cache.has(PATROL_ROLE_IDS.METCC);
    }).length;

    let embed = new EmbedBuilder()
        .setTitle('<:logo:1409845811109691563> Test Patrol')
        .setDescription(`Bookings are now **${patrolData.bookingsClosed ? "closed" : "open"}** for this patrol.`)
        .setColor(7171437)
        .setFooter({ text: "Roehampton Roleplay - Management Team", iconURL: "https://cdn.discordapp.com/attachments/1352368300784357482/1409845930378657863/Public_Discord.png" })
        .addFields(
            { name: "Patrol Starts", value: patrolData.start.display, inline: true },
            { name: "Patrol Ends", value: patrolData.end.display, inline: true },
            { name: "Bookings Close", value: patrolData.close.display, inline: true },
            { name: "MPS", value: `${mpsCount} / ∞`, inline: true },
            { name: "LAS", value: `${lasCount} / ∞`, inline: true },
            { name: "LFB", value: `${lfbCount} / ∞`, inline: true },
            { name: "Civilian Operations", value: `${civCount} / ∞`, inline: true },
            { name: "Total Ingame", value: `${patrolData.attending.length} / ∞`, inline: true },
            { name: "MetCC", value: `${metccCount} / ∞`, inline: true },
            { name: " ", value: " ", inline: false },
            { name: `Booked On (${patrolData.attending.length})`, value: patrolData.attending.length ? patrolData.attending.map(id => `<@${id}>`).join("\n") : "No One", inline: true },
            { name: " ", value: " ", inline: true },
            { name: `Not Attending (${patrolData.notAttending.length})`, value: patrolData.notAttending.length ? patrolData.notAttending.map(id => `<@${id}>`).join("\n") : "No One", inline: true }
        );
    return embed;
}

client.on('messageCreate', async message => {
    if (message.content.startsWith("!shift")) {
        patrolData.attending = [];
        patrolData.notAttending = [];
        patrolData.bookingsClosed = false;
        const msgParts = message.content.split(" ");
        if (msgParts[1] && msgParts[2]) {
            patrolData.start = formatDate(msgParts[1], msgParts[2]);
        }
        if (msgParts[3] && msgParts[4]) {
            patrolData.end = formatDate(msgParts[3], msgParts[4]);
        }
        if (msgParts[5] && msgParts[6]) {
            patrolData.close = formatDate(msgParts[5], msgParts[6]);
        }
        await message.delete();
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("yes")
                .setLabel("Attending")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("no")
                .setLabel("Not Attending")
                .setStyle(ButtonStyle.Danger)
        );
        const msg = await message.channel.send({
            embeds: [buildPatrolEmbed(message.guild)],
            components: [buttons],
        });

        const collector = msg.createMessageComponentCollector({
            time: 10000000,
            componentType: ComponentType.Button,
        });

        collector.on("collect", async (i) => {
            if (patrolData.bookingsClosed) {
                await i.reply({ content: "Bookings are now **closed** for this patrol.", ephemeral: true });
                return;
            }
            if (patrolData.attending.includes(i.user.id) || patrolData.notAttending.includes(i.user.id)) {
                await i.reply({ content: ":x: You have already decided.", ephemeral: true });
                return;
            }
            if (i.customId == "yes") patrolData.attending.push(i.user.id);
            else patrolData.notAttending.push(i.user.id);

            await msg.edit({ embeds: [buildPatrolEmbed(i.guild)] });
            await i.deferUpdate();
        });

        // Booking close timer
        const closeTime = new Date(patrolData.close.iso);
        if (!isNaN(closeTime.getTime())) {
const delay = Math.min(closeTime.getTime() - Date.now(), 2_147_483_647); // max 24.8 days
if (delay > 0) {
  setTimeout(() => {
    patrolData.bookingsClosed = true;
    msg.edit({ embeds: [buildPatrolEmbed(message.guild)] });
  }, delay);
}

        }
    }

    // Switch attending/not attending
    if (message.content.startsWith("!switch")) {
        const [, userId, status] = message.content.split(" ");
        if (status === "attending") {
            patrolData.notAttending = patrolData.notAttending.filter(id => id !== userId);
            if (!patrolData.attending.includes(userId)) patrolData.attending.push(userId);
        } else if (status === "notattending") {
            patrolData.attending = patrolData.attending.filter(id => id !== userId);
            if (!patrolData.notAttending.includes(userId)) patrolData.notAttending.push(userId);
        }
        // Find the patrol message and update
        const channel = message.channel;
        const messages = await channel.messages.fetch({ limit: 50 });
        const patrolMsg = messages.find(m =>
            m.embeds.length &&
            m.embeds[0].title === '<:logo:1409845811109691563> Test Patrol'
        );
        if (patrolMsg) {
            await patrolMsg.edit({ embeds: [buildPatrolEmbed(message.guild)] });
        }
        await message.delete();
    }

    // Book on command
    if (message.content.startsWith("!bookon")) {
        const [, userId] = message.content.split(" ");
        if (!patrolData.attending.includes(userId)) patrolData.attending.push(userId);
        patrolData.notAttending = patrolData.notAttending.filter(id => id !== userId);
        const channel = message.channel;
        const messages = await channel.messages.fetch({ limit: 10 });
        const patrolMsg = messages.find(m => m.embeds.length && m.embeds[0].title === '<:logo:1409845811109691563> Test Patrol');
        if (patrolMsg) await patrolMsg.edit({ embeds: [buildPatrolEmbed(message.guild)] });
        await message.delete();
    }

function parseIdsFromMentions(text) {
  if (!text || text === "No One") return [];
  return [...text.matchAll(/<@(\d+)>/g)].map(m => m[1]);
}

function hydratePatrolFromEmbed(embed) {
  // Find the two list fields by name
  const bookedField = embed.fields?.find(f => f.name?.startsWith("Booked On"));
  const notField    = embed.fields?.find(f => f.name?.startsWith("Not Attending"));

  // Rebuild arrays from the mentions already in the message
  patrolData.attending    = parseIdsFromMentions(bookedField?.value);
  patrolData.notAttending = parseIdsFromMentions(notField?.value);
}

if (message.content.startsWith("!openbookings")) {
  const [, messageId] = message.content.split(" ");
  const channel = message.channel;

  try {
    const patrolMsg = await channel.messages.fetch(messageId);

    if (patrolMsg && patrolMsg.embeds.length && patrolMsg.embeds[0].title === '<:logo:1409845811109691563> Test Patrol') {
      // 👇 Rehydrate state from what's already in the embed
      hydratePatrolFromEmbed(patrolMsg.embeds[0]);

      // Now safely reopen bookings without losing anyone
      patrolData.bookingsClosed = false;

      // Update the embed to reflect "open" status (keeps all existing attendees)
      await patrolMsg.edit({ embeds: [buildPatrolEmbed(message.guild)] });

      // Re-create buttons
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("yes")
          .setLabel("Attending")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("no")
          .setLabel("Not Attending")
          .setStyle(ButtonStyle.Danger)
      );
      await patrolMsg.edit({ components: [buttons] });

      // Re-create collector for this patrol message
      const collector = patrolMsg.createMessageComponentCollector({
        time: 10000000,
        componentType: ComponentType.Button,
      });

      collector.on("collect", async (i) => {
        if (patrolData.bookingsClosed) {
          await i.reply({ content: "Bookings are now **closed** for this patrol.", flags: MessageFlags.Ephemeral });
          return;
        }
        if (patrolData.attending.includes(i.user.id) || patrolData.notAttending.includes(i.user.id)) {
          await i.reply({ content: ":x: You have already decided.", ephemeral: true });
          return;
        }

        if (i.customId === "yes") {
          patrolData.notAttending = patrolData.notAttending.filter(id => id !== i.user.id);
          patrolData.attending.push(i.user.id);
        } else {
          patrolData.attending = patrolData.attending.filter(id => id !== i.user.id);
          patrolData.notAttending.push(i.user.id);
        }

        await patrolMsg.edit({ embeds: [buildPatrolEmbed(i.guild)] });
        await i.deferUpdate();
      });
    } else {
      await message.reply("Could not find patrol message with that ID.");
    }
  } catch (err) {
  }

  await message.delete();
}
});

client.login(process.env.TOKEN);
