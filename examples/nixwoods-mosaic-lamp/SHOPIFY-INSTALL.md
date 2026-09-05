# Installing the cube lamp page on nixwoods.com (no theme changes)

1. Online Store > Pages > Add page. Title: "The Rubik's Cube Lamp, up close". Handle: `cube-lamp`.
2. In the content editor click the `<>` (Show HTML) button and paste the whole of
   `nixwoods-cube-lamp-shopify-page.html`. Save. Visit /pages/cube-lamp to check.
3. Online Store > Themes > Customize > Products > Default product. In the "Product information"
   section click "Add block" > "Custom Liquid", drag it directly under "Buy buttons", and paste:

   <p style="margin:12px 0 0;font-size:14px"><a href="/pages/cube-lamp">See it turn: three moods, real reviews, straight answers &rarr;</a></p>

   Only this block is added; nothing else on the template changes. It shows on every product that
   uses the default template, so if you want it on the lamp only, wrap it:

   {% if product.handle == 'rubiks-cube-table-lamp-sheesham-wood' %} ... {% endif %}

4. Optional, for the pair price: Discounts > Create > Amount off products > automatic,
   ₹500 off when quantity of this product is 2 or more.
5. When the ad video is uploaded as product media, tell Claude and the hero gets the video.

Everything on the page is scoped under `.nxl`, so theme styles are not affected and the page's
styles do not leak out. Add to bag uses `/cart/add?id=VARIANT`; Buy now sends people to the
product page with that variant selected, so GoKwik checkout is used as normal.
