(async () => {
  const username = 'annhien.boibo'; // a popular creator
  const targetUrl = encodeURIComponent(`https://www.tiktok.com/@${username}`);
  const proxyUrl = `https://api.allorigins.win/get?url=${targetUrl}`;

  console.log("Fetching via allorigins...");
  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();
    const html = data.contents;
    if (!html) {
      console.log("No contents returned from allorigins.");
      return;
    }
    console.log("HTML length:", html.length);
    
    // Check for script block __UNIVERSAL_DATA_FOR_REHYDRATION__
    const match = html.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
    if (match) {
      const jsonStr = match[1];
      const parsed = JSON.parse(jsonStr);
      console.log("Found UNIVERSAL DATA!");
      const userState = parsed.__DEFAULT_SCOPE__?.['webapp.user-detail'];
      if (userState) {
        const userInfo = userState.userInfo;
        console.log("User Display Name:", userInfo.user.nickname);
        console.log("Avatar:", userInfo.user.avatarThumb);
        console.log("Followers:", userInfo.stats.followerCount);
        console.log("Hearts:", userInfo.stats.heartCount);
      } else {
        console.log("UserDetail state not found in default scope.");
      }
    } else {
      console.log("UNIVERSAL DATA script tag not found.");
      // check other elements
      const match2 = html.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);
      if (match2) {
        console.log("Found SIGI_STATE!");
        const parsed = JSON.parse(match2[1]);
        console.log("Sigi State keys:", Object.keys(parsed));
      } else {
        console.log("No SIGI_STATE either.");
      }
    }
  } catch (e) {
    console.error("Error scraping:", e);
  }
})();
