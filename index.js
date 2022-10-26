const token = `` // 디스코드 봇 Token (토큰)
const logchannel = `` // 쪽지 로그 채널ID
const { Client, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js')
const client = new Client({ intents: [131071] })
client.login(token)

client.on('ready', async () => {
    console.log(`${client.user.tag} 봇에 정상로그인 하였습니다.`)
    const commands = [
        new SlashCommandBuilder().setName(`쪽지`).setDescription(`익명 쪽지를 발송합니다.`).addUserOption(op => op.setName(`유저`).setDescription(`전송할 유저를 선택해주세요.`)).addStringOption(op => op.setName(`쪽지내용`).setDescription(`전송할 익명 쪽지 내용을 입력해주세요.`))
    ].map(command => command.toJSON());
    const rest = new REST({ version: '10' }).setToken(token);
    rest.put(Routes.applicationCommands(client.user.id), { body: commands }).catch(console.error);
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == '쪽지') {
        const msg = interaction.options.getString('쪽지내용')
        const user = interaction.options.getUser(`유저`)
        user.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`쪽지가 도착했습니다!`)
                    .setDescription(`${msg}`)
            ]
        })
        client.channels.cache.get(logchannel).send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`${msg}`)
                    .setTitle(`쪽지가 전송되어 로깅되었습니다.`)
                    .setFields(
                        { name: `유저`, value: `${interaction.user} (\` ${interaction.user.id} | ${interaction.user.tag} \`)` },
                        { name: `채널`, value: `${interaction.channel} (\` ${interaction.channel.id} | ${interaction.channel.name} \`)` },
                        { name: `전송시각`, value: `<t:${Math.round(new Date().getTime() / 1000)}>` },
                    )
            ]
        })
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`전송이 완료되었습니다.`)
            ], ephemeral: true
        })
    }
})