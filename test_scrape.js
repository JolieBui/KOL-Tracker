const fetch = require('node-fetch');

(async () => {
  const username = 'annhien.boibo'; // a popular creator
  const targetUrl = encodeURIComponent(`https://www.tiktok.com/@${username}`);
  const proxyUrl = `https://api.allorigins.win/get?url=${targetUrl}`;

  console.log("Fetching via allorigins...");
  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();
    const html = data.contents;
    console.log("HTML length:", html.length);
    
    // Search for __UNIVERSAL_DATA_FOR_REHYDRATION__
    const match = html.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
    if (match) {
      const jsonStr = match[1];
      const parsed = JSON.parse(jsonStr);
      console.log("Found UNIVERSAL DATA!");
      // Let's inspect some of the structure
      const userState = parsed.__DEFAULT_SCOPE__?.['webapp.user-detail'];
      if (userState) {
        const userInfo = userState.userInfo;
        console.log("User Display Name:", userInfo.user.nickname);
        console.log("Avatar:", userInfo.user.avatarThumb);
        console.log("Followers:", userInfo.stats.followerCount);
        console.log("Hearts:", userInfo.stats.heartCount);
      } else {
        console.log("UserDetail state not found in default scope. Keys:", Object.keys(parsed.__DEFAULT_SCOPE__ || {}));
      }
    } else {
      console.log("UNIVERSAL DATA script tag not found.");
      // Check for SIGI_STATE
      const matchSigi = html.match(/window\['SIGI_STATE'\]=([\s\S]*?);window\['SIGI_RETRY'\]/);
      if (matchSigi) {
        console.log("Found SIGI_STATE!");
      } else {
        console.log("SIGI_STATE not found either.");
      }
    }
  } catch (e) {
    console.error("Error scraping:", e);
  }
})();
