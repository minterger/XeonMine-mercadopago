const discord = document.getElementById('discord')

discord.addEventListener('click', () => {
    discord.classList.add('discord_active')
    discord.classList.replace('discordHover', 'discord_active')
    setTimeout(() => {
        window.open('https://discord.gg/A6SS8AbSGD', '_self')
    }, 500)
})