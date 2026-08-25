(async () => {
  const username = 'annhien.boibo';
  const target = encodeURIComponent(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${username}`);
  const url = `https://api.allorigins.win/get?url=${target}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      console.log("PROXY OEMBED SUCCESS!");
      const parsedContents = JSON.parse(json.contents);
      console.log(parsedContents);
    } else {
      console.log("PROXY OEMBED FAILED:", res.status, res.statusText);
    }
  } catch (e) {
    console.error("Error fetching oembed proxy:", e);
  }
})();
