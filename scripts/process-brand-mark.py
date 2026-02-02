#!/usr/bin/env python3
"""
Process the HIFZ brand mark:
- Remove white background
- Clip out the text (just keep the crest)
- Generate all required icon sizes
"""

from PIL import Image
import os

# Paths
INPUT = '/Users/admin/quran-oasis-git/public/hifz-brand-mark.jpg'
OUTPUT_DIR = '/Users/admin/quran-oasis-git/public'
ICONS_DIR = '/Users/admin/quran-oasis-git/public/icons'

# Icon sizes for PWA
ICON_SIZES = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512]

def remove_white_background(img, threshold=250):
    """Replace white/near-white pixels with transparency."""
    img = img.convert('RGBA')
    data = img.getdata()
    
    new_data = []
    for item in data:
        # If pixel is white-ish (all channels > threshold)
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))  # Transparent
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    return img

def crop_to_crest(img):
    """Crop the image to just the crest (removing the HIFZ text below)."""
    # Get image dimensions
    width, height = img.size
    
    # The crest takes roughly the top 68% of the image
    # HIFZ text is in the bottom portion - need to exclude it
    # Looking at the logo, the shield ends around 68% mark
    crop_height = int(height * 0.68)
    
    # Crop: (left, upper, right, lower)
    cropped = img.crop((0, 0, width, crop_height))
    return cropped

def crop_to_content(img):
    """Crop to actual content (remove transparent padding)."""
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img

def make_square(img, padding=10):
    """Make image square with optional padding."""
    # Get dimensions
    width, height = img.size
    
    # Determine the size of the square
    size = max(width, height) + (padding * 2)
    
    # Create new square image with transparency
    square = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    
    # Calculate position to center the image
    x = (size - width) // 2
    y = (size - height) // 2
    
    # Paste the image
    square.paste(img, (x, y), img)
    
    return square

def generate_icons(img, output_dir, sizes):
    """Generate icons at various sizes."""
    os.makedirs(output_dir, exist_ok=True)
    
    for size in sizes:
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        output_path = os.path.join(output_dir, f'icon-{size}x{size}.png')
        resized.save(output_path, 'PNG')
        print(f'  Created: icon-{size}x{size}.png')

def main():
    print(f'Loading: {INPUT}')
    img = Image.open(INPUT)
    print(f'  Original size: {img.size}')
    
    print('Removing white background...')
    img = remove_white_background(img)
    
    print('Cropping to crest (removing text)...')
    img = crop_to_crest(img)
    
    print('Cropping to content...')
    img = crop_to_content(img)
    print(f'  Cropped size: {img.size}')
    
    print('Making square...')
    img = make_square(img, padding=20)
    print(f'  Square size: {img.size}')
    
    # Save full-size crest
    crest_path = os.path.join(OUTPUT_DIR, 'hifz-crest.png')
    img.save(crest_path, 'PNG')
    print(f'Saved full crest: {crest_path}')
    
    # Generate icons
    print('Generating icons...')
    generate_icons(img, ICONS_DIR, ICON_SIZES)
    
    # Also save favicon.png at 32x32
    favicon = img.resize((32, 32), Image.Resampling.LANCZOS)
    favicon.save(os.path.join(OUTPUT_DIR, 'favicon.png'), 'PNG')
    print('Saved: favicon.png')
    
    # apple-touch-icon at 180x180
    apple_icon = img.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save(os.path.join(OUTPUT_DIR, 'apple-touch-icon.png'), 'PNG')
    print('Saved: apple-touch-icon.png')
    
    print('\n✅ Done! All icons generated.')

if __name__ == '__main__':
    main()
