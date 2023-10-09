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

    filename = os.path.join(output_directory, f'barcode_{i}.png')
    my_code.save(filename)
    print(f"Saved: {filename}")
