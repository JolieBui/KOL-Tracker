import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Fix TableView
text = re.sub(
    r'<TableView rows=\{filtered\} statusMap=\{statusMap\}',
    r'<TableView rows={filtered} statusMap={statusMap} statusStages={statusStages}',
    text
)

# Fix ProfileView
text = re.sub(
    r'<ProfileView\s+rows=\{data\}\s+onOpenProfile=\{k => setSelectedProfile\(k\)\}\s+campaignLabels=\{campaignLabels\}\s+/>',
    r'<ProfileView \n              rows={data} \n              onOpenProfile={k => setSelectedProfile(k)} \n              campaignLabels={campaignLabels}\n              dynamicCampaigns={dynamicCampaigns}\n              statusStages={statusStages}\n              statusMap={statusMap}\n            />',
    text,
    flags=re.MULTILINE
)

# Fix ProfileView in media performance ? wait, we only have one ProfileView invocation in App.
with open("src/App.jsx", "w") as f:
    f.write(text)

print("Invocations fixed")
