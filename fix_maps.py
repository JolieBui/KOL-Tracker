import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Replace CAMPAIGNS.map(c => c.key) with dynamicCampaigns.map(c => c.key)
text = re.sub(r'CAMPAIGNS\.map\(([^)]+)\)', r'dynamicCampaigns.map(\1)', text)
# Replace STATUS_STAGES.map(s => s.key) with statusStages.map(s => s.key) outside of the top-level definitions
text = re.sub(r'STATUS_STAGES\.map\(([^)]+)\)', r'statusStages.map(\1)', text)

# There is a KanbanView which uses STATUS_STAGES, let's pass statusStages to KanbanView
text = re.sub(r'const KanbanView = \(\{ data, onOpen, onOpenProfile, campaignLabels \}\) => \{', r'const KanbanView = ({ data, onOpen, onOpenProfile, campaignLabels, statusStages, statusMap }) => {', text)
text = re.sub(r'<KanbanView\n\s*data=\{filtered\}', r'<KanbanView\n                data={filtered}\n                statusStages={statusStages}\n                statusMap={statusMap}', text)

# StatusBadge uses statusMap, which needs to be passed down.
text = re.sub(r'const StatusBadge = \(\{ statusKey \}\) => \{', r'const StatusBadge = ({ statusKey, statusMap }) => {', text)
text = re.sub(r'<StatusBadge statusKey=\{([^\}]+)\} />', r'<StatusBadge statusKey={\1} statusMap={statusMap} />', text)

# ProfileDetailModal uses StatusBadge
text = re.sub(r'const ProfileDetailModal = \(\{ kol, onClose, campaignLabels, onSaveProfile, onOpenRow \}\) => \{', r'const ProfileDetailModal = ({ kol, onClose, campaignLabels, onSaveProfile, onOpenRow, statusMap }) => {', text)
text = re.sub(r'<ProfileDetailModal\n\s*kol=\{selectedProfile\}', r'<ProfileDetailModal\n          kol={selectedProfile}\n          statusMap={statusMap}', text)

# TableView uses StatusBadge
text = re.sub(r'const TableView = \(\{ rows, onOpen, onSave, campaignLabels \}\) => \{', r'const TableView = ({ rows, onOpen, onSave, campaignLabels, statusMap }) => {', text)
text = re.sub(r'<TableView rows=\{filtered\}', r'<TableView rows={filtered} statusMap={statusMap}', text)

# DetailModal uses STATUS_STAGES.map which we changed to statusStages.map, but wait, DetailModal needs statusStages prop!
text = re.sub(r'const DetailModal = \(\{ kol, onClose, onSave, onDelete \}\) => \{', r'const DetailModal = ({ kol, onClose, onSave, onDelete, statusStages, dynamicCampaigns }) => {', text)
text = re.sub(r'<DetailModal\n\s*kol=\{selected\}', r'<DetailModal\n          kol={selected}\n          statusStages={statusStages}\n          dynamicCampaigns={dynamicCampaigns}', text)
text = re.sub(r'<DetailModal\n\s*kol=\{emptyKOL\(\)\}', r'<DetailModal\n          kol={emptyKOL()}\n          statusStages={statusStages}\n          dynamicCampaigns={dynamicCampaigns}', text)

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Updated maps and props")
