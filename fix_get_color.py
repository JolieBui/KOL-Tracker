import re

with open("src/App.jsx", "r") as f:
    text = f.read()

color_func = """
const PREDEFINED_COLORS = ["#FFAFA3", "#A2C2E8", "#A8C3A0", "#FFD175", "#C7B1E6", "#F4A261", "#E76F51", "#2A9D8F", "#E9C46A", "#264653"];
const getCampaignColor = (key) => {
  if (!key) return "#888";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PREDEFINED_COLORS[Math.abs(hash) % PREDEFINED_COLORS.length];
};
"""

# Insert after DEFAULT_STATUS_STAGES
text = re.sub(r'(const DEFAULT_STATUS_STAGES = \[.*?\];)', r'\1\n' + color_func, text, flags=re.DOTALL)

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Added getCampaignColor")
