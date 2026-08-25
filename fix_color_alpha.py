import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Update handleChange in StatusSettingsModal
text = text.replace('arr[idx][field] = val;', 'arr[idx][field] = val;\n    if (field === "color") arr[idx].soft = val + "22";')

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Fixed alpha background")
