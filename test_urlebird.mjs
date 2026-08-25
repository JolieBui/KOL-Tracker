(async () => {
  const username = 'annhien.boibo';
  const target = encodeURIComponent(`https://urlebird.com/user/${username}/`);
  const url = `https://api.allorigins.win/get?url=${target}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      console.log("URLEBIRD SUCCESS!");
      const html = json.contents;
      console.log("HTML length:", html.length);
      // Find avatar
      const avatarMatch = html.match(/<img class="[^"]*user-img[^"]*"\s+src="([^"]+)"/i) || html.match(/<img[^>]+src="([^"]+)"[^>]+class="[^"]*avatar[^"]*"/i);
      console.log("Avatar Match:", avatarMatch ? avatarMatch[1] : "not found");
      // Find followers
      const followersMatch = html.match(/<b>Followers:<\/b>\s*([\d\.\w]+)/i) || html.match(/<span>Followers:<\/span>\s*<b>([^<]+)<\/b>/i);
      console.log("Followers Match:", followersMatch ? followersMatch[1] : "not found");
    } else {
      console.log("URLEBIRD FAILED:", res.status, res.statusText);
    }
  } catch (e) {
    console.error("Error fetching urlebird:", e);
  }
})();
