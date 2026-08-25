import fs from 'fs';
const html = fs.readFileSync('urlebird_search.html', 'utf-8');

const userBlocks = html.match(/<div class="user my-2[^"]*">([\s\S]*?)<\/div>\s*<\/div>/g);
console.log("Blocks found:", userBlocks ? userBlocks.length : 0);

if (userBlocks) {
  const block = userBlocks[0];
  const avatarMatch = block.match(/data-src="([^"]+)"/) || block.match(/src="([^"]+)"/);
  const avatarUrl = avatarMatch ? avatarMatch[1] : "";

  const nicknameMatch = block.match(/<span>([^<]+)<\/span>/);
  const nickname = nicknameMatch ? nicknameMatch[1] : "";

  const followersMatch = block.match(/<span class="followers">([^<]+)<\/span>/);
  const followersText = followersMatch ? followersMatch[1] : "";
  let followersValue = followersText.replace(/followers/i, "").trim();

  console.log("Parsed Profile:");
  console.log("  Avatar URL:", avatarUrl);
  console.log("  Nickname:", nickname);
  console.log("  Followers:", followersValue);
}
