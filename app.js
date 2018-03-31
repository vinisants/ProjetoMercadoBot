// load env variables from the .env file
require('dotenv-extended').load()

const restify = require('restify');
const builder = require('botbuilder');
const request = require('request');
const moment = require('moment');
const cards = require('./cards')


//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
const server = restify.createServer();
const port = process.env.port || process.env.PORT || 3978
server.listen(port, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Criacao do chat conector para se comunicar com o Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector)
bot.set('storage', new builder.MemoryBotStorage())

// Endpoint que irá monitorar as mensagens do usuário
server.post('/api/messages', connector.listen());

function saudacao(){
    const split_afternoon = 12
    const split_evening = 17
    const currentHour = parseFloat(moment().utc().format('HH'))
    if(currentHour >= split_afternoon && currentHour <= split_evening){
        return 'Boa noite'
    }
    else if (currentHour >= split_evening) {
        return 'Boa tarde'
    }
    return 'Bom dia'
}

//=========================================================
// Implementação do BOT com LUIS + API
//=========================================================
const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL)

const intents = new builder.IntentDialog({
    recognizers: [recognizer]
})

intents.onDefault((session, args) => {
    session.send(`Desculpe, não consegui entender a frase: ${session.message.text}.`)
})

intents.matches('Sobre', (session, args) => {
    session.send('Eu sou um bot e estou sempre aprendendo. Tenha paciência comigo.')
})

intents.matches('Cumprimento', (session, args) => {
    session.send('Olá! Em que posso lhe ajudar?')
})

intents.matches('ValorProduto', (session, args) => {
    const produtos = builder.EntityRecognizer.findAllEntities(args.entities, 'Produto').map(p => p.entity).join(', ')

    session.send(`Eu farei a busca do valor do(s) produtos(s): **${produtos}**. Aguarde um momento enquanto eu obtenho os valores.`)

    // Chamada a API de valores de produtos
    request (process.env.COTACAO_ENDPOINT + `/${produtos}`, (err, res, body) => {
        if(err || !body)
            return session.send('Ocorreu algum erro, por favor tente novamente mais tarde.')

        const cotacoes = JSON.parse(body)

        for (var i = 0, len = cotacoes.length; i < len; i++) {
            const card = cards.Create(cotacoes[i], session)
            const reply = new builder.Message(session).addAttachment(card)
            session.send(reply) 
        }  
    })
})

bot.on('conversationUpdate', (update) => {
    if (update.membersAdded) {
        update.membersAdded.forEach( (identity) => {
            if (identity.id === update.address.bot.id) {
                bot.loadSession(update.address, (err, session) => {
                    if(err)
                        return err
                    const message = `${saudacao()}! Eu sou o bot **SupermercadoOnline**, que verifica o preço de produtos. Em que posso lhe ajudar?\n`
                    session.send(message)
                })
            }
        })
    }
})

bot.dialog('/',intents)