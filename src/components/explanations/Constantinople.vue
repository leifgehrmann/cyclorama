<script setup lang="ts">

import Attribution from "./Attribution.vue";
</script>

<template>
  <h1 class="text-center leading-3 text-xl mb-10"><span class="font-bold" style="font-variant: small-caps"><span class="text-4xl">Panorama</span><br> of <br><span class="my-4 text-4xl">Constantinople.</span></span><br> and Environs.</h1>
  <p class="text-center text-sm">
    <small>Drawn on the spot by</small><br> Henry Aston Barker<br>
    <small>Etched by</small> Charles Tomkins<br>
    <small>Aquatinted by</small> Frederick Christian Lewis <br><small>and </small>George Robert Lewis<br>
  </p>
  <p class="text-center text-sm">
    <small>Published</small> January 1<sup>st</sup> 1813,<br><small> by</small> Thomas Palser, Surry side Westminster Bridge<br> <small>and</small> Henry Aston Barker, West Square.
  </p>
  <hr>
  <p>This work is a digital composition of two reproductions of aquatints.</p>
  <p>High-resolution (but colourless) scans come from the Library of Congress.</p>
  <details>
    <summary>Reproduction Numbers</summary>
    <ul>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04189">LC-DIG-pga-04189</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04190">LC-DIG-pga-04190</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04191">LC-DIG-pga-04191</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04192">LC-DIG-pga-04192</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04193">LC-DIG-pga-04193</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04194">LC-DIG-pga-04194</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04195">LC-DIG-pga-04195</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04196">LC-DIG-pga-04196</a></li>
    </ul>
  </details>
  <p>Coloured (but low-resolution) scans come from King George Ⅲ's Personal Coloured Views Collection.</p>
  <details>
    <summary>Shelfmarks</summary>
    <ul>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-1.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.3.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-2.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.4.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-3.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.5.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-4.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.6.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-5.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.7.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-6.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.8.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-7.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.9.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-8.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.10.</a></li>
    </ul>
  </details>
  <p><a href="https://imagemagick.org">ImageMagick</a> commands were then used by Leif&nbsp;Gehrmann to compose the pictures together.</p>
  <details>
    <summary>Commands</summary>
    <pre>
mkdir constantinople-high-res-color

# Warp the low-res color images so that the coordinates match the position on the high-res image.
magick constantinople-king-george-iii/maps_k_top_113_75_f_3.jpg -extent 6492x7402 -alpha set -virtual-pixel transparent -distort Perspective '168,438 793,2139   1310,408 6298,2007   1292,1180 6221,5751   102,1262 474,6173' constantinople-high-res-color/color-map-1.jpg
magick constantinople-king-george-iii/maps_k_top_113_75_f_4.jpg -extent 6457x7293 -alpha set -virtual-pixel transparent -distort Perspective '230,393 1108,1859   1284,399 6196,1871   1138,1134 5494,5439   93,1134 447,5454' constantinople-high-res-color/color-map-2.jpg
magick constantinople-king-george-iii/maps_k_top_113_75_f_5.jpg -extent 6492x7437 -alpha set -virtual-pixel transparent -distort Perspective '145,409 674,1867   1226,440 5846,2069   1265,1226 6004,5849   114,1176 489,5579' constantinople-high-res-color/color-map-3.jpg
magick constantinople-king-george-iii/maps_k_top_113_75_f_6.jpg -extent 6492x7402 -alpha set -virtual-pixel transparent -distort Perspective '84,398 382,1837   1268,443 6090,2104   1220,1099 5834,5273   170,1163 778,5570' constantinople-high-res-color/color-map-4.jpg
magick constantinople-king-george-iii/maps_k_top_113_75_f_7.jpg -extent 6468x7476 -alpha set -virtual-pixel transparent -distort Perspective '107,467 492,2221   1274,410 6325,1990   1129,1247 5579,6165   271,1118 1291,5518' constantinople-high-res-color/color-map-5.jpg
magick constantinople-king-george-iii/maps_k_top_113_75_f_8.jpg -extent 6408x7354 -alpha set -virtual-pixel transparent -distort Perspective '60,443 281,2061   1282,425 6149,2045   1204,1230 5738,5932   147,1227 648,5880' constantinople-high-res-color/color-map-6.jpg
magick constantinople-king-george-iii/maps_k_top_113_75_f_9.jpg -extent 6528x7498 -alpha set -virtual-pixel transparent -distort Perspective '151,457 731,2142   1287,508 6177,2463   1281,1291 6120,6222   206,1225 946,5895' constantinople-high-res-color/color-map-7.jpg
magick constantinople-king-george-iii/maps_k_top_113_75_f_10.jpg -extent 6492x7282 -alpha set -virtual-pixel transparent -distort Perspective '57,547 229,2651   1268,554 5994,2666   1245,1223 5910,5878   48,1243 182,5991' constantinople-high-res-color/color-map-8.jpg

# Apply colors onto the TIFFs.
convert constantinople-loc/master-pnp-pga-04100-04189u.tif constantinople-high-res-color/color-map-1.jpg -compose colorize -composite constantinople-high-res-color/high-res-color-1.jpg
convert constantinople-loc/master-pnp-pga-04100-04190u.tif constantinople-high-res-color/color-map-2.jpg -compose colorize -composite constantinople-high-res-color/high-res-color-2.jpg
convert constantinople-loc/master-pnp-pga-04100-04191u.tif constantinople-high-res-color/color-map-3.jpg -compose colorize -composite constantinople-high-res-color/high-res-color-3.jpg
convert constantinople-loc/master-pnp-pga-04100-04192u.tif constantinople-high-res-color/color-map-4.jpg -compose colorize -composite constantinople-high-res-color/high-res-color-4.jpg
convert constantinople-loc/master-pnp-pga-04100-04193u.tif constantinople-high-res-color/color-map-5.jpg -compose colorize -composite constantinople-high-res-color/high-res-color-5.jpg
convert constantinople-loc/master-pnp-pga-04100-04194u.tif constantinople-high-res-color/color-map-6.jpg -compose colorize -composite constantinople-high-res-color/high-res-color-6.jpg
convert constantinople-loc/master-pnp-pga-04100-04195u.tif constantinople-high-res-color/color-map-7.jpg -compose colorize -composite constantinople-high-res-color/high-res-color-7.jpg
convert constantinople-loc/master-pnp-pga-04100-04196u.tif constantinople-high-res-color/color-map-8.jpg -compose colorize -composite constantinople-high-res-color/high-res-color-8.jpg

# Deskew
convert constantinople-high-res-color/high-res-color-1.jpg -deskew 40% constantinople-high-res-color/deskew-1.jpg
convert constantinople-high-res-color/high-res-color-2.jpg -deskew 40% constantinople-high-res-color/deskew-2.jpg
convert constantinople-high-res-color/high-res-color-3.jpg -deskew 40% constantinople-high-res-color/deskew-3.jpg
convert constantinople-high-res-color/high-res-color-4.jpg -deskew 40% constantinople-high-res-color/deskew-4.jpg
convert constantinople-high-res-color/high-res-color-5.jpg -deskew 40% constantinople-high-res-color/deskew-5.jpg
convert constantinople-high-res-color/high-res-color-6.jpg -deskew 40% constantinople-high-res-color/deskew-6.jpg
convert constantinople-high-res-color/high-res-color-7.jpg -deskew 40% constantinople-high-res-color/deskew-7.jpg
convert constantinople-high-res-color/high-res-color-8.jpg -deskew 40% constantinople-high-res-color/deskew-8.jpg

# Crop
magick constantinople-high-res-color/deskew-1.jpg -crop 6350x6272+96+211  +repage  constantinople-high-res-color/crop-1.jpg
magick constantinople-high-res-color/deskew-2.jpg -crop 6223x6272+161+69  +repage  constantinople-high-res-color/crop-2.jpg
magick constantinople-high-res-color/deskew-3.jpg -crop 6276x6272+104+114  +repage  constantinople-high-res-color/crop-3.jpg
magick constantinople-high-res-color/deskew-4.jpg -crop 6316x6272+98+64  +repage  constantinople-high-res-color/crop-4.jpg
magick constantinople-high-res-color/deskew-5.jpg -crop 6291x6272+113+99  +repage  constantinople-high-res-color/crop-5.jpg
magick constantinople-high-res-color/deskew-6.jpg -crop 6236x6272+79+94  +repage  constantinople-high-res-color/crop-6.jpg
magick constantinople-high-res-color/deskew-7.jpg -crop 6329x6272+114+120  +repage  constantinople-high-res-color/crop-7.jpg
magick constantinople-high-res-color/deskew-8.jpg -crop 6324x6272+86+112  +repage  constantinople-high-res-color/crop-8.jpg

# Combine the image into one big panorama.
montage constantinople-high-res-color/crop-[1-8].jpg -tile 8x1 -geometry +0+0 constantinople-high-res-color/constantinople-full.jpg
    </pre>
  </details>
</template>

<style scoped>

</style>