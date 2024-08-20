from rembg import remove
from PIL import Image
import requests
import sys
import io

def remove_background(image_url, output_path):
    try:
        # Fetch the image from the URL
        response = requests.get(image_url)
        response.raise_for_status()

        # Open the image
        input_image = Image.open(io.BytesIO(response.content))

        # Crop the image to the top-left quadrant (1024 x 1024 pixels)
        width, height = input_image.size
        crop_area = (0, 0, min(1024, width), min(1024, height))
        input_image = input_image.crop(crop_area)

        # Remove the background
        output_image = remove(input_image)

        # Save the output image
        output_image.save(output_path)
        print(f"Output saved to {output_path}")
    except Exception as e:
        print(f"Error processing image: {e}", file=sys.stderr)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python remove_background.py <image_url> <output_path>")
        sys.exit(1)

    image_url = sys.argv[1]
    output_path = sys.argv[2]
    print(f"Processing image from URL: {image_url}")
    remove_background(image_url, output_path)
