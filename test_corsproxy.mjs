(async () => {
  const username = 'annhien.boibo';
  const target = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${username}`;
  const url = `https://corsproxy.io/?${encodeURIComponent(target)}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      console.log("CORSPROXY OEMBED SUCCESS!");
      console.log(json);
    } else {
      console.log("CORSPROXY OEMBED FAILED:", res.status, res.statusText);
      const txt = await res.text();
      console.log(txt.slice(0, 500));
    }
  } catch (e) {
    console.error("Error fetching corsproxy:", e);
  }
})();
