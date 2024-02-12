# This script splits an image that is greater than 4096 pixels in width into
# individual images.
MAX_SIZE=4096

image_dir=`dirname $1`
image_base=`basename $1`
image_base=${image_base%.jpg}

image_width=`identify -ping -format '%w' $1`
image_height=`identify -ping -format '%h' $1`
split_count_width=`echo "($image_width + $MAX_SIZE - 1)/$MAX_SIZE" | bc`
split_count_height=`echo "($image_height + $MAX_SIZE - 1)/$MAX_SIZE" | bc`

# Resize the image to a width that is divisible by the split count.
remainder_width=`echo "($image_width % $split_count_width)" | bc`
new_image_width=`echo "($image_width + $split_count_width - $remainder_width)" | bc`
new_image_filename="${image_dir}/${image_base}.splittable.jpg"
magick "$1" -scale "${new_image_width}x${new_image_width}" "$new_image_filename"

# Then split the image into appropriate chunks.
convert "$new_image_filename" -crop "${split_count_width}x${split_count_height}@" "${image_dir}/${image_base}-%02d.jpg"
rm $new_image_filename