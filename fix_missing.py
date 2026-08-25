import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Fix addedCount, mergedCount
text = text.replace('const updatedData = [...data];\n            \n            importedRows.forEach', 
                    'let addedCount = 0;\n            let mergedCount = 0;\n            const updatedData = [...data];\n            \n            importedRows.forEach')

# TableView: needs statusStages
text = text.replace('const TableView = ({ rows, onOpen, onSave, campaignLabels, statusMap }) => {', 'const TableView = ({ rows, onOpen, onSave, campaignLabels, statusMap, statusStages }) => {')
text = text.replace('<TableView rows={filtered} statusMap={statusMap}', '<TableView rows={filtered} statusMap={statusMap} statusStages={statusStages}')

# ImportWizard: needs statusMap
text = text.replace('const ImportWizard = ({ rawHeaders, rawRows, sheetInfo, fileName, onConfirm, onClose, campaignLabels, statusLabelToKey }) => {', 'const ImportWizard = ({ rawHeaders, rawRows, sheetInfo, fileName, onConfirm, onClose, campaignLabels, statusLabelToKey, statusMap }) => {')

text = text.replace('<ImportWizard\n              statusLabelToKey={statusLabelToKey}\n              rawHeaders={importData.headers}', '<ImportWizard\n              statusLabelToKey={statusLabelToKey}\n              statusMap={statusMap}\n              rawHeaders={importData.headers}')
text = text.replace('<ImportWizard\n            statusLabelToKey={statusLabelToKey}\n            rawHeaders={importData.headers}', '<ImportWizard\n            statusLabelToKey={statusLabelToKey}\n            statusMap={statusMap}\n            rawHeaders={importData.headers}')
text = text.replace('<ImportWizard\n            statusLabelToKey={statusLabelToKey}\n            rawHeaders={importState.headers}', '<ImportWizard\n            statusLabelToKey={statusLabelToKey}\n            statusMap={statusMap}\n            rawHeaders={importState.headers}')

# DualFileImportModal: Needs statusMap (to pass to ImportWizard?? Wait, is ImportWizard inside DualFileImportModal??)
# Let's check if ImportWizard is called from DualFileImportModal
# If so, DualFileImportModal needs statusMap passed to it too!
