const builder = require('botbuilder')

const ArrozName = 'arroz'
const FeijaoName = 'feijao'
const LeiteName = 'leite'

const arrozImageCard = session => builder.CardImage.create(session, 'http://www.tiojoao.com.br/img/100-graos-nobres.png')
const arrozUrlLink = session => builder.CardAction.openUrl(session, "https://www.google.com.br/search?q=arroz+tio+jo%C3%A3o&source=lnms&tbm=shop&sa=X&ved=0ahUKEwjP6NWZlZfaAhXMiZAKHd3YCBEQ_AUICigB&biw=1280&bih=614", 'Comprar Agora')
const feijaoImageCard = session =>  builder.CardImage.create(session, 'http://cdn7.bigcommerce.com/s-yymwg9lo5b/images/stencil/700x900/products/188/577/biju_preto__18877.1485743297.jpg?c=2')
const feijaoUrlLink = session => builder.CardAction.openUrl(session, "https://www.google.com.br/search?q=feijao+biju&source=lnms&tbm=shop&sa=X&ved=0ahUKEwj24oGLlZfaAhXDvJAKHXJ3AmcQ_AUICygC&biw=1280&bih=614", 'Comprar Agora')
const leiteImageCard = session => builder.CardImage.create(session, 'https://www.zonasul.com.br/ImgProdutos/280_280/37128.jpg')
const leiteUrlLink = session => builder.CardAction.openUrl(session, "https://www.google.com.br/search?biw=1280&bih=614&tbm=shop&ei=-8-_WujHM4WZwQS73ISADQ&q=leite+elege&oq=leite+elege&gs_l=psy-ab.3..0l2.24722.25956.0.26098.11.8.0.3.3.0.119.554.0j5.5.0....0...1c.1.64.psy-ab..3.8.563....0.NBECyqQQOqw", 'Comprar Agora')

///CARD ARROZ
const createArrozHeroCard = (selected, session) => {
    return new builder.HeroCard(session)
                    .title(selected.nome)
                    .subtitle('R$: ' + selected.valor)
                    .text(selected.descricao)
                    .images([arrozImageCard(session)])
                    .buttons([arrozUrlLink(session)])
}

///CARD FEIJAO
const createFeijaoHeroCard = (selected, session) => {
    return new builder.HeroCard(session)
                    .title(selected.nome)
                    .subtitle('R$: ' + selected.valor)
                    .text(selected.descricao)
                    .images([feijaoImageCard(session)])
                    .buttons([feijaoUrlLink(session)])
}

///CARD LEITE
const createLeiteHeroCard = (selected, session) => {
    return new builder.HeroCard(session)
                    .title(selected.nome)
                    .subtitle('R$: ' + selected.valor)
                    .text(selected.descricao)
                    .images([leiteImageCard(session)])
                    .buttons([leiteUrlLink(session)])
}

const create = (selected, session) => {
    switch(selected.nome.toLowerCase()){
        case ArrozName:
            return createArrozHeroCard(selected, session)
        case FeijaoName:
            return createFeijaoHeroCard(selected, session)
        case LeiteName:
            return createLeiteHeroCard(selected, session)
    }
}

module.exports = {
    CardNames: [ArrozName, FeijaoName, LeiteName],
    Create: create
}