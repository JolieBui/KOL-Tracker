import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Fix ProfileView signature
text = re.sub(r'const ProfileView = \(\{ rows, onOpenProfile, campaignLabels \}\) => \{', r'const ProfileView = ({ rows, onOpenProfile, campaignLabels, dynamicCampaigns, statusStages, statusMap }) => {', text)

# Fix ProfileView invocation
text = re.sub(r'<ProfileView rows=\{data\} onOpenProfile=\{r => setSelectedProfile\(r\)\} campaignLabels=\{campaignLabels\} />', r'<ProfileView rows={data} onOpenProfile={r => setSelectedProfile(r)} campaignLabels={campaignLabels} dynamicCampaigns={dynamicCampaigns} statusStages={statusStages} statusMap={statusMap} />', text)
text = re.sub(r'<ProfileView rows=\{filtered\} onOpenProfile=\{r => setSelectedProfile\(r\)\} campaignLabels=\{campaignLabels\} />', r'<ProfileView rows={filtered} onOpenProfile={r => setSelectedProfile(r)} campaignLabels={campaignLabels} dynamicCampaigns={dynamicCampaigns} statusStages={statusStages} statusMap={statusMap} />', text)

# Fix addedCount, mergedCount
text = re.sub(r'const updatedData = \[\.\.\.data\];\s*importedRows\.forEach', r'let mergedCount = 0;\n            let addedCount = 0;\n            const updatedData = [...data];\n            importedRows.forEach', text)

with open("src/App.jsx", "w") as f:
    f.write(text)

print("Final fix completed")
