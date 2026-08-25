const viewers = [
  'https://urlebird.com/user/annhien.boibo/',
  'https://tiktalker.com/user/annhien.boibo/'
];

for (const v of viewers) {
  const target = encodeURIComponent(v);
  const url = `https://api.allorigins.win/get?url=${target}`;
  console.log("Fetching from:", v);
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const html = json.contents;
      console.log("  Success! Length:", html ? html.length : 0);
      if (html && html.length > 2000) {
        // Let's write the first 1000 chars
        console.log("  Snippet:", html.slice(0, 500));
        // Check if there is an avatar or followers
        const avatarMatch = html.match(/<img class="[^"]*user-img[^"]*"\s+src="([^"]+)"/i) || html.match(/<img[^>]+src="([^"]+)"[^>]+class="[^"]*avatar[^"]*"/i) || html.match(/<div class="[^"]*user-image[^"]*".*?src="([^"]+)"/i) || html.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
        console.log("  Avatar:", avatarMatch ? avatarMatch[1] : "not found");
      }
    } else {
      console.log("  Failed status:", res.status);
    }
  } catch (e) {
    console.error("  Error:", e.message);
  }
}
