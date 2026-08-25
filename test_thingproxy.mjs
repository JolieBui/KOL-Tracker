(async () => {
  const username = 'annhien.boibo';
  const target = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${username}`;
  const url = `https://thingproxy.freeboard.io/fetch/${target}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      console.log("THINGPROXY SUCCESS!");
      console.log(json);
    } else {
      console.log("THINGPROXY FAILED:", res.status, res.statusText);
      const txt = await res.text();
      console.log(txt.slice(0, 500));
    }
  } catch (e) {
    console.error("Error fetching thingproxy:", e);
  }
})();
