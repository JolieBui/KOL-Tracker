import re

with open("src/App.jsx", "r") as f:
    text = f.read()

text = text.replace("DEFAULT_statusStages", "DEFAULT_STATUS_STAGES")

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Fixed DEFAULT_STATUS_STAGES")
