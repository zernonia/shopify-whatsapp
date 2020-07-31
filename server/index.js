require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const serve = require('koa-static-server');
const bodyParser = require('koa-body')
const { router } = require('./routes.js');
const { Nuxt, Builder } = require('nuxt')

const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

dotenv.config();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

async function start () {
  const app = new Koa()
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000

  // Import and Set Nuxt.js options
  const config = require('../nuxt.config.js')
  config.dev = !(app.env === 'production')

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  
  app.use(bodyParser())
  app.use(session({ secure: true, sameSite: 'none' }, app));
  app.keys = [SHOPIFY_API_SECRET_KEY];
  app.use(router.routes());
  app.use(router.allowedMethods());    

  app.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_themes, write_themes,read_script_tags, write_script_tags'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set('shopOrigin', shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        ctx.cookies.set('accessToken', accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });

        const res = await fetch(`https://${shop}/admin/api/2020-07/script_tags.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-Shopify-Access-Token": accessToken,
          },
          body: JSON.stringify({
            script_tag: {
              event: "onload",
              src: `https://${host}:${port}/scripts/whatsapp.js`
            }
          })
        })
        
        const resJson = await res.json()
        console.log(resJson)
        ctx.redirect('/');
      },
    }),
    );
    
    app.use(verifyRequest());
    app.use(serve({rootDir: './static', rootPath: '/scripts'}))
    

    
    app.use( ctx => {
      ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })
  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}

start()