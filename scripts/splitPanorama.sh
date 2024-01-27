# This script splits an image that is greater than 4096 pixels in width into
# individual images.
MAX_SIZE=4096

image_dir=`dirname $1`
image_base=`basename $1`
image_base=${image_base%.jpg}

image_width=`identify -ping -format '%w' $1`
split_count=`echo "($image_width + $MAX_SIZE - 1)/$MAX_SIZE" | bc`

# Resize the image to a width that is divisible by the split count.
remainder=`echo "($image_width % $split_count)" | bc`
new_image_width=`echo "($image_width + $split_count - $remainder)" | bc`
new_image_filename="${image_dir}/${image_base}.splittable.jpg"
magick "$1" -scale "${new_image_width}x${new_image_width}" "$new_image_filename"

# Then split the image into appropriate chunks.
convert "$new_image_filename" -crop "${split_count}x1@" "${image_dir}/${image_base}-%02d.jpg"
rm $new_image_filename