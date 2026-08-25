(async () => {
  const username = 'annhien.boibo';
  const url = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${username}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      console.log("OEMBED SUCCESS!");
      console.log(json);
    } else {
      console.log("OEMBED FAILED:", res.status, res.statusText);
      const txt = await res.text();
      console.log(txt.slice(0, 500));
    }
  } catch (e) {
    console.error("Error fetching oembed:", e);
  }
})();
