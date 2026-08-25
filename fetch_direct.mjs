import fs from 'fs';
(async () => {
  const username = 'annhien.boibo';
  const url = `https://urlebird.com/user/${username}/`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html'
      }
    });
    if (res.ok) {
      const text = await res.text();
      fs.writeFileSync('urlebird_direct.html', text);
      console.log("DIRECT FETCH SUCCESS! Length:", text.length);
    } else {
      console.log("DIRECT FETCH FAILED:", res.status, res.statusText);
    }
  } catch (e) {
    console.error("Error fetching direct:", e);
  }
})();
