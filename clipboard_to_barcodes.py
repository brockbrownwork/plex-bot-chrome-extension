import os
import barcode
from barcode.writer import ImageWriter
import pyperclip

def clear_directory(directory):
    """
    Deletes all files in the specified directory.
    """
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Failed to delete {file_path}. Reason: {e}")

# Get the content from the clipboard
clipboard_content = pyperclip.paste()

# Split the content by newlines
codes = clipboard_content.split("\n")
codes = [code.strip("\r") for code in codes]

# Ensure there's a directory named 'barcode_output', if not, create one
output_directory = "barcode_output"
if not os.path.exists(output_directory):
    os.makedirs(output_directory)
else:
    # Clear existing files in the directory
    clear_directory(output_directory)

# For each code, generate a barcode PNG and save it
for i, code in enumerate(codes):
    # Use Code128 which supports alphanumeric characters
    CODE128 = barcode.get_barcode_class('code128')
    my_code = CODE128(code, writer=ImageWriter())

    filename = os.path.join(output_directory, f'barcode_{i}')
    my_code.save(filename)
    print(f"Saved: {filename}")

from PIL import Image
import os

# Define the directory where your images are stored
input_folder = "barcode_output"

# Iterate through each file in the directory
for filename in os.listdir(input_folder):
    # Check if the file is an image (based on the file extension)
    if filename.endswith('.jpg') or filename.endswith('.png') or filename.endswith('.jpeg'):

        # Construct the full path of the file
        filepath = os.path.join(input_folder, filename)
        
        # Open the image using Pillow
        with Image.open(filepath) as img:
            # Get the current size of the image
            width, height = img.size

            # Compute the new size (halve the width and height)
            new_size = (width // 2, height // 2)

            # Resize the image to the new size
            img_resized = img.resize(new_size)

            # Save the resized image back to the same location (overwriting the original)
            img_resized.save(filepath)

        print(f"Resized {filename} to half its original size")

print("All images have been resized!")

