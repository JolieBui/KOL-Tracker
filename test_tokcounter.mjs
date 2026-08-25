(async () => {
  const username = 'annhien.boibo';
  const url = `https://tokcounter.com/api/user/info/${username}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (res.ok) {
      const json = await res.json();
      console.log("TOKCOUNTER SUCCESS!");
      console.log(json);
    } else {
      console.log("TOKCOUNTER FAILED:", res.status, res.statusText);
      const text = await res.text();
      console.log(text.slice(0, 300));
    }
  } catch (e) {
    console.error("Error fetching tokcounter:", e);
  }
})();
