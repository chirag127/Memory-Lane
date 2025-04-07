# Create simple PNG icons directly without SVG conversion
# Generates icon16.png, icon48.png, and icon128.png
import os
from PIL import Image, ImageDraw

def create_icon(png_file, size, bg_color='#4a90e2', fg_color='white'):
    # Make sure the output directory exists
    os.makedirs(os.path.dirname(png_file), exist_ok=True)

    # Create a new image with the specified size and background color
    img = Image.new('RGBA', size, bg_color)
    draw = ImageDraw.Draw(img)

    # Calculate dimensions for a simple memory lane icon (a bookmark with a clock)
    width, height = size
    padding = max(1, int(width * 0.15))

    # Draw a bookmark shape
    bookmark_width = width - (padding * 2)
    bookmark_height = height - (padding * 2)

    # Draw a rounded rectangle for the bookmark
    corner_radius = max(1, int(width * 0.1))
    draw.rounded_rectangle(
        [(padding, padding), (width - padding, height - padding)],
        fill=fg_color,
        radius=corner_radius
    )

    # Draw a small circle in the center to represent a clock/memory
    circle_radius = max(1, int(width * 0.15))
    circle_center = (width // 2, height // 2)
    draw.ellipse(
        [(circle_center[0] - circle_radius, circle_center[1] - circle_radius),
         (circle_center[0] + circle_radius, circle_center[1] + circle_radius)],
        fill='#ffcc00'
    )

    # Save the image
    img.save(png_file, 'PNG')
    print(f"Created {png_file} with size {size[0]}x{size[1]}")

# Convert to different sizes
sizes = [(16, 16), (48, 48), (128, 128)]

for size in sizes:
    width, height = size
    png_file = f'extension/images/icon{width}.png'
    create_icon(png_file, size)