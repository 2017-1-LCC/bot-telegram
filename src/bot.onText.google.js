const TelegramBot = require( `node-telegram-bot-api` )
const http = require( `axios` )
const cheerio = require( `cheerio` )

const TOKEN = `418459560:AAG6WN4n3F9BQKZOsrw2Lys_UPa-0cJE3BQ`

const bot = new TelegramBot( TOKEN, { polling: true } )
const URL_BASE = `https://www.google.com.br/search?q=`

const log = ( msg ) => ( result ) =>
  console.log( msg, result )

const sanitizeURL = ( url ) =>
  url.replace( `/url?q=`, `` )
      .replace( /\&sa(.*)/, `` )

const getURLFrom = ( elem, $ ) =>
  `Link: ` + sanitizeURL( $( elem ).attr( `href` ) )

const sendLinkFromGoogleUsing = ( $, msg ) => ( i, a ) =>
  ( !i ) // get only first link
    ? bot.sendMessage( msg.chat.id, getURLFrom( a, $ ) )
          .then( log( `${getURLFrom( a, $ )} delivered!` ) )
          .catch( log( `Error: ` ) )
    : false

const sendLinkFrom = ( msg ) => ( response ) =>
  cheerio.load( response.data )( `.r a` )
          .each( sendLinkFromGoogleUsing( cheerio.load( response.data ),
                                          msg ) )

const sendGoogle = ( msg, match ) =>
  http.get( `${URL_BASE}${match[ 1 ]}` )
      .then( sendLinkFrom( msg ) )
      .catch( log( `Error: `) )

module.exports = sendGoogle

//bot.onText( /google (.*)/, sendGoogle );
