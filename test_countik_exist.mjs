(async () => {
  const username = 'annhien.boibo';
  const url = `https://countik.com/api/exist/${username}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (res.ok) {
      const json = await res.json();
      console.log("COUNTIK EXIST SUCCESS!");
      console.log(json);
    } else {
      console.log("COUNTIK EXIST FAILED:", res.status, res.statusText);
    }
  } catch (e) {
    console.error("Error fetching countik exist:", e);
  }
})();
