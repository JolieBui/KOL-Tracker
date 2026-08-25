import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Update DualFileImportModal props
text = re.sub(r'const DualFileImportModal = \(\{ existingData, onClose, onConfirm, onImportSingle \}\) => \{', r'const DualFileImportModal = ({ existingData, onClose, onConfirm, onImportSingle, statusLabelToKey }) => {', text)
text = re.sub(r'const processFiles = async \(fileList\) => \{', r'const processFiles = async (fileList, statusLabelToKey) => {', text)
# In DualFileImportModal, fix calls to processFiles
text = re.sub(r'processFiles\(e\.dataTransfer\.files\)', r'processFiles(e.dataTransfer.files, statusLabelToKey)', text)
text = re.sub(r'processFiles\(e\.target\.files\)', r'processFiles(e.target.files, statusLabelToKey)', text)

# Pass it from App
text = re.sub(r'<DualFileImportModal\n\s*existingData=\{data\}', r'<DualFileImportModal\n          existingData={data}\n          statusLabelToKey={statusLabelToKey}', text)

# Update App.jsx where it defines dynamicCampaigns, we need it!
app_state_injection = """  const dynamicCampaigns = useMemo(() => {
    const uniqueKeys = Array.from(new Set(data.map(d => d.campaign).filter(Boolean)));
    return uniqueKeys.map(key => ({
      key,
      label: campaignLabels[key] || key
    }));
  }, [data, campaignLabels]);
"""
# inject after campaignLabels in App
text = re.sub(r'(const \[campaignLabels, setCampaignLabels\].*?\}\);)', r'\1\n' + app_state_injection, text, flags=re.DOTALL)

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Updated DualFileImportModal props and added dynamicCampaigns")
