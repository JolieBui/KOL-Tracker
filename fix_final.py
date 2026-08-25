import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Define DEFAULT_STATUS_STAGES at the module level
default_stages = """
const DEFAULT_STATUS_STAGES = [
  { key: "waiting_food",   label: "Chờ duyệt món ăn",   color: "#E28B65", soft: "#FAF0EB" },
  { key: "waiting_script", label: "Chờ duyệt script",   color: "#B284A3", soft: "#FAF0F6" },
  { key: "doing_demo",     label: "Đang làm demo",       color: "#5E9BE2", soft: "#EBF3FC" },
  { key: "waiting_demo",   label: "Chờ duyệt demo",      color: "#E28B65", soft: "#FAF0EB" },
  { key: "revised_demo",   label: "Demo đã chỉnh sửa",   color: "#B284A3", soft: "#FAF0F6" },
  { key: "confirmed_demo", label: "Demo đã duyệt",       color: "#47B39C", soft: "#EBF8F5" },
  { key: "aired",          label: "Đã lên sóng",         color: "#8A7BFF", soft: "#F4F2FF" },
];
"""

# Match everything from `const statusStages = [` up to `const cleanName = (str) => {`
old_block_pattern = r'const statusStages = \[\n.*?const cleanName = \(str\) => \{'

text = re.sub(old_block_pattern, default_stages + "\nconst cleanName = (str) => {", text, flags=re.DOTALL)

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Fixed DEFAULT_STATUS_STAGES correctly")
