import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Remove campaign validation checks
text = re.sub(r'if \(!CAMPAIGNS\.find\(c => c\.key === sheetCampaignKey\)\) return;\n', '', text)
text = re.sub(r'if \(!CAMPAIGNS\.find\(c => c\.key === campaignKey\)\) continue;\n', '', text)
text = re.sub(r'if \(iCampaign < 0 && !CAMPAIGNS\.find\(c => c\.key === sheetCampaignKey\)\) return;\n', '', text)
text = re.sub(r'if \(!CAMPAIGNS\.find\(c => c\.key === campaignKey\)\) return;\n', '', text)

# Pass statusLabelToKey to parsers
text = re.sub(r'const parseInternalWorkbook = \(wb\) => \{', r'const parseInternalWorkbook = (wb, statusLabelToKey) => {', text)
text = re.sub(r'const parseSocialWorkbook = \(wb\) => \{', r'const parseSocialWorkbook = (wb, statusLabelToKey) => {', text)

# Find where STATUS_LABEL_TO_KEY is used globally and replace with statusLabelToKey
# Inside parsers
text = re.sub(r'STATUS_LABEL_TO_KEY\[([^\]]+)\]', r'(statusLabelToKey[\1])', text)

# In processFiles, we need to accept statusLabelToKey
text = re.sub(r'const processFiles = async \(files\) => \{', r'const processFiles = async (files, statusLabelToKey) => {', text)
text = re.sub(r'parseInternalWorkbook\(internalWb\)', r'parseInternalWorkbook(internalWb, statusLabelToKey)', text)
text = re.sub(r'parseSocialWorkbook\(socialWb\)', r'parseSocialWorkbook(socialWb, statusLabelToKey)', text)

# When processFiles is called in importSingleFile and handleDualFileMerge, pass statusLabelToKey
# Note: Since importSingleFile and handleDualFileMerge are inside App, they can just use statusLabelToKey!
# Wait, are they inside App? Yes! Let's check.

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Updated parsers")
