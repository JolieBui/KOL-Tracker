import re

with open("src/App.jsx", "r") as f:
    lines = f.read().splitlines()

def patch_line(i, search, repl):
    if search in lines[i]:
        lines[i] = lines[i].replace(search, repl)
        print(f"Patched line {i}")
    else:
        print(f"Failed to patch line {i}")

# 859: ImportWizard missing statusMap in signature
# ImportWizard is around line 774
for i, line in enumerate(lines):
    if line.startswith('const ImportWizard = ({ rawHeaders, rawRows, sheetInfo, fileName, onConfirm, onClose, campaignLabels, statusLabelToKey }) => {'):
        lines[i] = line.replace('statusLabelToKey })', 'statusLabelToKey, statusMap })')

# 1560: DualFileImportModal processFiles uses statusLabelToKey
# DualFileImportModal is around line 1505
for i, line in enumerate(lines):
    if line.startswith('const DualFileImportModal = ({ existingData, onConfirm, onClose, onImportSingle }) => {'):
        lines[i] = line.replace('onImportSingle })', 'onImportSingle, statusLabelToKey, statusMap })')

# 1633: processFiles in DualFileImportModal (already passed properly if DualFileImportModal has it)

# 1757: setRoles -> setStep("drop")
for i, line in enumerate(lines):
    if 'setRoles(null)' in line:
        lines[i] = line.replace('setRoles(null)', '')

# 2159: TableView missing statusStages
for i, line in enumerate(lines):
    if line.startswith('const TableView = ({ rows, onOpen, onSave, campaignLabels, statusMap }) => {'):
        lines[i] = line.replace('statusMap })', 'statusMap, statusStages })')

# 2811, 2833: MasterDatabase missing dynamicCampaigns and statusStages
for i, line in enumerate(lines):
    if line.startswith('const MasterDatabase = ({ data, onUpdate, onUndo, onRedo, history, redoHistory, onReset, TYPES, campaignLabels }) => {'):
        lines[i] = line.replace('campaignLabels })', 'campaignLabels, dynamicCampaigns, statusStages, statusMap, statusLabelToKey, showStatusSettings, setShowStatusSettings, setStatusStages })')

# Fix MasterDatabase invocation inside App.jsx
for i, line in enumerate(lines):
    if '<MasterDatabase data={data}' in line:
        lines[i] = line.replace('<MasterDatabase data={data}', '<MasterDatabase data={data} dynamicCampaigns={dynamicCampaigns} statusStages={statusStages} statusMap={statusMap} statusLabelToKey={statusLabelToKey} showStatusSettings={showStatusSettings} setShowStatusSettings={setShowStatusSettings} setStatusStages={setStatusStages}')

# Fix DualFileImportModal invocation
for i, line in enumerate(lines):
    if '<DualFileImportModal\n' in line or '<DualFileImportModal ' in line:
        pass # we can do this with re.sub over the whole string

with open("src/App.jsx", "w") as f:
    f.write('\n'.join(lines))

import sys
with open("src/App.jsx", "r") as f:
    text = f.read()
text = re.sub(r'<DualFileImportModal\n\s*existingData=\{data\}', r'<DualFileImportModal\n          existingData={data}\n          statusLabelToKey={statusLabelToKey}\n          statusMap={statusMap}', text)
text = re.sub(r'<ImportWizard\n\s*rawHeaders=', r'<ImportWizard\n              statusLabelToKey={statusLabelToKey}\n              statusMap={statusMap}\n              rawHeaders=', text)
with open("src/App.jsx", "w") as f:
    f.write(text)

print("Brute force fix completed")
