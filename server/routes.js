const Router = require('koa-router');
const router = new Router();

// Import queries and mutations here

const prepareAuth = (ctx) => {
    const accessToken = ctx.cookies.get("accessToken");
    const shopOrigin = ctx.cookies.get("shopOrigin");
    return {
        accessToken: accessToken,
        shop: shopOrigin
    }
};

router.get('/getTag', async ctx => {
  const { shop, accessToken } = prepareAuth(ctx)
  const res = await fetch(`https://${shop}/admin/api/2020-07/script_tags.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken,
    }
  })
  const resJson = await res.json()
  ctx.body = resJson
})

router.post('/update/:id', async ctx => {
  const data = JSON.parse(ctx.request.body)
  const dataQuery = toQueryString(data.data)
  const { shop, accessToken } = prepareAuth(ctx)
  const res = await fetch(`https://${shop}/admin/api/2020-07/script_tags/${ctx.params.id}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      script_tag: {
        id: ctx.params.id,
        src: `https://1c17122265b9.ngrok.io/scripts/whatsapp.js?${dataQuery}`
      }
    })
  })
  const resJson = await res.json()
  ctx.body = resJson
})

router.get('/delete/:id', async ctx => {
  const { shop, accessToken } = prepareAuth(ctx)
    const deleteJson = await fetch(`https://${shop}/admin/api/2020-07/script_tags/${ctx.params.id}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "X-Shopify-Access-Token": accessToken,
      }
    })
    const deleteAll = await deleteJson.json()
    ctx.body = deleteAll
})

function toQueryString(data){
  var queryString = ''
  for(const key in data){
    var temp = `${key}`+ '=' + `${data[key]}` + '&'
    queryString = queryString.concat(temp)
  }
  queryString = queryString.slice(0,-1)
  return queryString
  
}

module.exports = {
    router
}