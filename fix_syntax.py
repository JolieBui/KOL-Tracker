import re

with open("src/App.jsx", "r") as f:
    text = f.read()

text = text.replace('((statusLabelToKey[(row[iStatus]) || "").toString().toLowerCase().trim()] || "")', '(statusLabelToKey[(row[iStatus] || "").toString().toLowerCase().trim()] || "")')

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Fixed syntax")
