import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Fix KanbanView signature
text = text.replace('const KanbanView = ({ rows, onOpen, onUpdateStatus, campaignLabels }) => (', 'const KanbanView = ({ rows, onOpen, onUpdateStatus, campaignLabels, statusStages, statusMap }) => (')

# Fix KanbanView instantiation inside App
text = text.replace('<KanbanView \n              rows={filtered}', '<KanbanView \n              rows={filtered} \n              statusStages={statusStages}\n              statusMap={statusMap}')

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Fixed KanbanView")
