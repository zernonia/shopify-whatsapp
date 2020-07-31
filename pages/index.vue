<template>
  <div class="container">
    <polaris-layout class="">
      <polaris-layout-annotated-section
          title="Store details"
          description="Shopify and your customers will use this information to contact you.">
          <polaris-callout-card 
            title="Customize the style of your checkout"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            :primary-action="{content:'Customize', onAction: testAlert}"
            :secondary-action="{content:'Not now', onAction: testAlert}">
            <p>Upload your store's logo, change colors and fonts, <b>and more</b>.</p>
          </polaris-callout-card>
      </polaris-layout-annotated-section>
    </polaris-layout>

    <polaris-layout class="mt">
      <polaris-layout-annotated-section
          title="Store details"
          description="Shopify and your customers will use this information to contact you.">
          <polaris-card 
              sectioned
              :primary-footer-action="{content: 'View Content really quick?', onAction: testAlert}"
              title="Online store dashboard">
              <p>View a summary of your online store's performance.</p>
          </polaris-card>
      </polaris-layout-annotated-section>
    </polaris-layout>

    <polaris-footer-help>
      Learn more about 
      <polaris-link url="https://help.shopify.com/manual/orders/fulfill-orders">fulfilling orders</polaris-link>.
    </polaris-footer-help>
  </div>
</template>

<script>
export default {
  data: () => ({
    tag : {},
  }),
  methods:{
    async testAlert(){
      console.log('action')
      fetch(`/update/${this.tag.script_tags[0].id}`,{
        method: 'POST',
        body: JSON.stringify({
          data:{
            size: 50,
            fill: 'eeeeee',
            
          }
        })
      }).then( res => res.json()).then( res => {
          console.log(res)
        })
    }
  },
  mounted(){
    fetch(`/getTag`).then( res => res.json()).then( (tag) => {
      this.tag = tag
      console.log(this.tag.script_tags)
    })
  }
}
</script>

<style>
.container{
  padding: 2rem 4rem;
}
.mt{
  margin-top: 0.5rem;
}
html{
  font-size: 10px;
}
</style>
