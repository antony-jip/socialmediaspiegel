# socialmediaspiegel.nl

Eén pagina: ontwerp je spiegel live, stuur een aanvraag in.

    npm install
    npm run dev          # http://localhost:3107

## .env.local

    FAL_KEY=...                         # alleen voor scripts/fal-beeld.mjs
    RESEND_API_KEY=...                  # aanvragen mailen
    AANVRAAG_NAAR=...                   # waar aanvragen binnenkomen
    MAIL_VAN="Socialmediaspiegel <aanvraag@socialmediaspiegel.nl>"

## Sfeerfoto's

    node --env-file=.env.local scripts/fal-beeld.mjs          # alle vier
    node --env-file=.env.local scripts/fal-beeld.mjs kapper   # één opnieuw

Muren zonder spiegel; de site hangt de spiegel er live overheen. Zonder foto valt de muur terug op een vlakke kleur.

Prijzen in `lib/spiegel.js` zijn een voorstel.
