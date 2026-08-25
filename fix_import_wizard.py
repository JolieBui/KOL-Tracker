import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Fix applyMapping
text = text.replace('const applyMapping = (rawRows, mapping) => {', 'const applyMapping = (rawRows, mapping, statusLabelToKey) => {')

# Fix ImportWizard
text = text.replace('const ImportWizard = ({ rawHeaders, rawRows, sheetInfo, fileName, onConfirm, onClose, campaignLabels }) => {', 'const ImportWizard = ({ rawHeaders, rawRows, sheetInfo, fileName, onConfirm, onClose, campaignLabels, statusLabelToKey }) => {')
text = text.replace('const converted = applyMapping(rawRows, draftMapping);', 'const converted = applyMapping(rawRows, draftMapping, statusLabelToKey);')
text = text.replace('const mapped = applyMapping(rawRows, mapping);', 'const mapped = applyMapping(rawRows, mapping, statusLabelToKey);')

# Pass statusLabelToKey to ImportWizard inside App
text = text.replace('<ImportWizard\n              rawHeaders={importData.headers}', '<ImportWizard\n              statusLabelToKey={statusLabelToKey}\n              rawHeaders={importData.headers}')
text = text.replace('<ImportWizard\n            rawHeaders={importData.headers}', '<ImportWizard\n            statusLabelToKey={statusLabelToKey}\n            rawHeaders={importData.headers}')
text = text.replace('<ImportWizard\n            rawHeaders={importState.headers}', '<ImportWizard\n            statusLabelToKey={statusLabelToKey}\n            rawHeaders={importState.headers}')

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Fixed ImportWizard and applyMapping")
