import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Find App declaration
app_decl = r'const App = \(\) => \{\n'
new_state = """  const [statusStages, setStatusStages] = useState(() => {
    try {
      const s = localStorage.getItem("kol_status_stages");
      return s ? JSON.parse(s) : DEFAULT_STATUS_STAGES;
    } catch {
      return DEFAULT_STATUS_STAGES;
    }
  });
  const statusMap = useMemo(() => Object.fromEntries(statusStages.map(s => [s.key, s])), [statusStages]);
  const statusLabelToKey = useMemo(() => {
    return Object.fromEntries([
      ...statusStages.map(s => [s.label.toLowerCase(), s.key]),
      ...statusStages.map(s => [s.key.toLowerCase(), s.key])
    ]);
  }, [statusStages]);
  const [showStatusSettings, setShowStatusSettings] = useState(false);
"""

text = re.sub(app_decl, app_decl + new_state, text)

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Injected status state into App")
