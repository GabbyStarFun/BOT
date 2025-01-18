const {
  Client,
  IntentsBitField,
  GatewayIntentBits,
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
  Events,
  ActivityType,
  TextInputStyle,
  ModalBuilder,
  TextInputBuilder,
  ComponentType,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.MessageCreate, async (message) => {
  if (
    message.content.startsWith("!shift") &&
    message.member.roles.cache.some((role) => role.id == "1323653572713255003")
  ) {
    const startTime = message.content.split(" ")[1];
    const endTime = message.content.split(" ")[2];
    const embed = new EmbedBuilder()
      .setTitle("Shift")
      .setDescription(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Viverra vitae congue eu consequat. Ornare lectus sit amet est."
      )
      .setColor(0x485c98)
      .addFields(
        {
          name: "Time Starting",
          value: startTime,
          inline: true,
        },
        {
          name: "Time Ending",
          value: endTime,
          inline: true,
        },
        {
          name: " ",
          value: " ",
          inline: true,
        },
        {
          name: "Attending",
          value: "No One",
          inline: true,
        },
        {
          name: "Not Attending",
          value: "No One",
          inline: true,
        }
      );

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
      components: [buttons],
      embeds: [embed],
    });

    const collector = msg.createMessageComponentCollector({
      time: 10000000,
      componentType: ComponentType.Button,
    });

    let attending = [];
    let notAttending = [];
    collector.on("collect", async (i) => {
      if (attending.includes(i.user.id) || notAttending.includes(i.user.id)) {
        await i.deferReply({
          ephemeral: true,
        });
        await i.editReply({
          content: ":x: You have already decided.",
        });
        return;
      }
      await i.deferUpdate();
      if (i.customId == "yes") attending.push(i.user.id);
      else notAttending.push(i.user.id);

      const embed = new EmbedBuilder()
        .setTitle("Shift")
        .setDescription(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Viverra vitae congue eu consequat. Ornare lectus sit amet est."
        )
        .setColor(0x485c98)
        .addFields(
          {
            name: "Time Starting",
            value: startTime,
            inline: true,
          },
          {
            name: "Time Ending",
            value: endTime,
            inline: true,
          },
          {
            name: " ",
            value: " ",
            inline: true,
          },
          {
            name: "Attending",
            value:
              attending.length == 0
                ? "No One"
                : attending.map((e) => "<@" + e + ">").join("\n"),
            inline: true,
          },
          {
            name: "Not Attending",
            value:
              notAttending.length == 0
                ? "No One"
                : notAttending.map((e) => "<@" + e + ">").join("\n"),
            inline: true,
          }
        );
      await i.editReply({
        embeds: [embed],
      });
    });
  }

  // -- DM Command --\\
  if (
    message.content.startsWith("!dm") &&
    message.member.roles.cache.some((role) => role.id == "1323734368296108205") // Check if the user has the specific role
  ) {
    // Split the message into its components
    const args = message.content.split(" ");
    const userId = args[1]; // First argument: user ID
    const dmDetails = args.slice(2).join(" "); // Second argument: DM details

    try {
      // Fetch the user using the provided user ID
      const user = await client.users.fetch(userId);

      // Create the embed message
      const embed = new EmbedBuilder()
        .setTitle("Direct Message")
        .setColor(0x485c98)
        .setDescription(`${dmDetails}`)
        .setFooter({ text: "Salcombe RPC - Direct Message" });

      // Send the embed to the user
      await user.send({ embeds: [embed] });
      await message.channel.send(`Message sent to user: ${userId}`);
    } catch (error) {
      console.error("Failed to send message: ", error);
      await message.channel.reply(
        `Failed to send DM to <@${userId}>. Make sure the user exists and allows DMs.`
      );
    }
  }
});

let database = [];

client.on("messageCreate", async (message) => {
  // Command to add data to the database
  if (
    message.content.startsWith(";addtodatabase") &&
    message.member.roles.cache.some((role) => role.id == "1324522548372963430") // Check if the user has the specific role
  ) {
    // Split the message into its components
    const args = message.content.split(" ").slice(1); // Remove the command part

    if (args.length < 4) {
      return message.channel.send("You need to provide all the required details (User ID, Callsign, Roleplay Name, Service).");
    }

    const userId = args[0]; // First argument: user ID
    const Usercallsign = args[1]; // Second argument: Callsign
    const RoleplayName = args.slice(2, -1).join(" "); // Join the middle arguments (Roleplay Name) into one string
    const Service = args[args.length - 1]; // Last argument: Service

    // Add the data to the "database" array
    database.push({ userId, Usercallsign, RoleplayName, Service });

    // Confirm addition
    await message.channel.send(`Added data to the database:
      User ID: ${userId}
      Callsign: ${Usercallsign}
      Roleplay Name: ${RoleplayName}
      Service: ${Service}`);
  }

  // Command to display all the stored data
  if (message.content.startsWith(";database")) {
    if (database.length === 0) {
      return message.channel.send("No records in the database yet.");
    }

    // Create the embed message with database entries
    const embed = new EmbedBuilder()
      .setTitle("📥 - Database Records")
      .setColor(0x485c98)
      .setDescription(
        database.map((data, index) => `
          **Record ${index + 1}**:
          **User ID**: ${data.userId}
          **Callsign**: ${data.Usercallsign}
          **Roleplay Name**: ${data.RoleplayName}
          **Service**: ${data.Service}
        `).join("\n")
      )
      .setFooter({ text: "📨 - Salcombe RPC" });

    // Create a close button
    const closeButton = new ButtonBuilder()
      .setCustomId('close_button')
      .setLabel('Close')
      .setStyle(ButtonStyle.Danger); // Red button style

    // Create an action row with the button
    const row = new ActionRowBuilder().addComponents(closeButton);

    try {
      // Send the embed with the close button
      const sentMessage = await message.channel.send({
        embeds: [embed],
        components: [row] // Add the button to the message
      });

      // Wait for interaction with the button (within 30 seconds)
      const filter = i => i.customId === 'close_button' && i.user.id === message.author.id;
      const collector = sentMessage.createMessageComponentCollector({
        filter,
        time: 30000 // 30 seconds for the interaction to expire
      });

      collector.on('collect', async (interaction) => {
        await interaction.update({ content: 'Message closed!', components: [] }); // Optionally notify when closed
        setTimeout(() => sentMessage.delete(), 1000); // Delete the message after 1 second
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          sentMessage.edit({ content: 'The close button has expired.', components: [] }); // Optionally notify if the time expired
        }
      });

    } catch (error) {
      console.error("Failed to send message: ", error);
      await message.channel.reply(`Failed to send embed. Please try again.`);
    }
  }
});



client.on("messageCreate", async (message) => {
  if (
    message.content.startsWith(";invite") &&
    message.member.roles.cache.some((role) => role.id == "1323734368296108205") // Check if the user has the specific role
  ) {
    // Split the message into its components
    const args = message.content.split(" ");
    const userId = args[1]; // First argument: user ID
    const dmDetails = args.slice(2).join(" "); // Second argument: DM details

    try {
      // Fetch the user using the provided user ID
      const user = await client.users.fetch(userId);

      // Create the embed message
      const embed = new EmbedBuilder()
        .setTitle("📥 - Message Inbox")
        .setColor(0x485c98)
        .setDescription(`${dmDetails}`)
        .setFooter({ text: "📨 - Salcombe RPC Inbox" });

      // Send the embed to the user
      await user.send({ embeds: [embed] });
      await message.channel.send(`Message sent to user: ${userId}`);
    } catch (error) {
      console.error("Failed to send message: ", error);
      await message.channel.reply(
        `Failed to send DM to <@${userId}>. Make sure the user exists and allows DMs.`
      );
    }
  }
});


client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId == "test") {
      console.log("\n" + interaction.user.username + " Clicked the button");

      const modal = new ModalBuilder().setCustomId("testModal").setTitle("Input");

      const input1 = new TextInputBuilder()
        .setCustomId("service")
        .setLabel("Entry Route?")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      const input2 = new TextInputBuilder()
        .setCustomId("age")
        .setRequired(true)
        .setLabel("What is your age?")
        .setStyle(TextInputStyle.Short);

      const input3 = new TextInputBuilder()
        .setCustomId("firstName")
        .setRequired(true)
        .setLabel("What is your first Name")
        .setStyle(TextInputStyle.Short);

      const input4 = new TextInputBuilder()
        .setCustomId("secondName")
        .setRequired(true)
        .setLabel("What is your second Name")
        .setStyle(TextInputStyle.Short);

      const input5 = new TextInputBuilder()
        .setCustomId("more")
        .setRequired(true)
        .setLabel("Anthing Else?")
        .setStyle(TextInputStyle.Paragraph);

      const firstActionRow = new ActionRowBuilder().addComponents(input1);
      const secondActionRow = new ActionRowBuilder().addComponents(input2);
      const thirdActionRow = new ActionRowBuilder().addComponents(input3);
      const fouthActionRow = new ActionRowBuilder().addComponents(input4);
      const fithActionRow = new ActionRowBuilder().addComponents(input5);

      modal.addComponents(
        firstActionRow,
        secondActionRow,
        thirdActionRow,
        fouthActionRow,
        fithActionRow
      );

      await interaction.showModal(modal);
    }

    if (interaction.customId == "deny") {
      await interaction.deferUpdate();
      const embed = new EmbedBuilder(interaction.message.embeds[0])
        .setTitle("Request Denied")
        .setColor("Red");
      await interaction.editReply({
        components: [],
        embeds: [embed],
      });
    }

    if (interaction.customId.startsWith("accept")) {
      await interaction.deferUpdate();
      const split = interaction.customId.split("&*&*");
      const userId = split[1];
      const service = split[2].toLowerCase();
      const nickname = split[3];
      const member = await interaction.guild.members.fetch(userId);
      const id = Math.floor(Math.random() * 9_000) + 1_000;

      let role;
      if (service.includes("ambulance")) {
        role = "1196087628030808154";
      } else if (service.includes("police")) {
        role = "1196087596678394036";
      } else if (service.includes("fire")) {
        role = "1196087661102911578";
      }

      await member.roles
        .add(member.guild.roles.cache.get(role))
        .catch((e) => e);
      await member.setNickname("[" + id + "]" + " " + nickname).catch((e) => e);

      await interaction.editReply({
        embeds: [
          new EmbedBuilder(interaction.message.embeds[0])
            .setTitle("Request Accepted")
            .setColor("Green"),
        ],
        components: [],
      });

      const user = client.users.cache.get(userId);
      const embed = new EmbedBuilder()
        .setColor(5540425)
        .setFooter({
          text: "Bromley RPC - Management Team",
        })
        .setTitle("Whitelisted - Acceptance")
        .setDescription(
          `We hope this message finds you well. We are pleased to inform you that there has been an update regarding your application. Your attention is now required to proceed further.\n\nPlease find the details of the update in the attached document/linked file or provided information. Should you have any questions or require further assistance, please do not hesitate to reach out to us.\n\nWe appreciate your prompt attention to this matter and look forward to your continued engagement with our services.\n\nThank you for your cooperation and swift action.\n\nWarm regards,\nThe Management Team`
        );

      await user.send({ embeds: [embed] }).catch((e) => e);
    }
  }

  if (interaction.isModalSubmit()) {
    const id = Math.floor(Math.random() * 9_000) + 1_000;
    const service = interaction.fields.getTextInputValue("service");
    const age = interaction.fields.getTextInputValue("age");
    const firstName = interaction.fields.getTextInputValue("firstName");
    const secondName = interaction.fields.getTextInputValue("secondName");
    const more = interaction.fields.getTextInputValue("more");

    const channel = client.channels.cache.get("1323653572713255003");

    await channel.send({
      content: "",
      embeds: [
        new EmbedBuilder()
        .setAuthor({
          name: interaction.user.globalName ?? interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTitle("BROMLEY - ENTRY REQUEST")
      .setColor("Blue")
          .setDescription(
            `Service: ${service}\nName: ${firstName} ${secondName}\nAge: ${age}\nAnything Else: ${more}`
          )
          .addFields(
            {
              name: "Service",
              value: service,
              inline: true,
            },
            {
              name: "Age",
              value: age,
              inline: true,
            },
            {
              name: "Name",
              value: `${firstName.charAt(0)}. ${secondName}`,
              inline: true,
            },
            { name: "More", value: more }
          ),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(
              `accept&*&*${interaction.user.id}&*&*${service}&*&*${firstName} ${secondName}`
            )
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("deny")
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });
    await interaction.reply({
      ephemeral: true,
      content:
        "We have received your request and it has been sent to our team for review. You'll be notified soon.",
    });
  }
});

client.login(
  "MTE2MzQyMDUzNzMxODU1MTU1Mg.Gt7Sr_.daYErJVdcJXLpEnBB40OdIcFfF_ypy3fOnmYww"
  
);

client.on("ready", async (u) => {
  console.log(u.user.username + " Is Online");

  client.user.setPresence({
    activities: [
      {
        name: `SalcombeRPC.roblox.com`,

        type: ActivityType.Custom,
      },
    ],
    status: "Watching",
  
  }  )


  const channel = client.channels.cache.get("1323656887492673638");
  const embed = new EmbedBuilder()
  .setColor("Blue")
  .setFooter({
    iconURL: "https://cdn.discordapp.com/emojis/1323656434663165992.webp?size=40",
    text: "Salcombe RPC - Chlxrb",
  })
    .setDescription(
      "Whether you’re looking to fast-track your application through our Accelerated Entry Route or prefer to take the Standard Route, all the details and support you need are available here."
);

   const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setURL ("https://discord.gg/jVJ34efqPH")
      .setLabel("Member Discord")
    .setStyle(ButtonStyle.Link)
   );

  // const msg = await channel.send({
  // embeds: [embed],
  //  components: [buttons],
  // });
 //  console.log(msg);

  

});