import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Replace CAMPAIGN_COLOR[something] with getCampaignColor(something)
text = re.sub(r'CAMPAIGN_COLOR\[([^\]]+)\]', r'getCampaignColor(\1)', text)
# Remove CAMPAIGN_LABELS usages where it's a fallback
text = re.sub(r'\|\|\s*CAMPAIGN_LABELS\[([^\]]+)\]', '', text)
# Remove the old CAMPAIGN_COLOR and CAMPAIGN_LABELS definitions if they are somehow still there
text = re.sub(r'const CAMPAIGN_COLOR = .*?;\n', '', text)
text = re.sub(r'const CAMPAIGN_LABELS = .*?;\n', '', text)

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Fixed CAMPAIGN_COLOR and CAMPAIGN_LABELS")
