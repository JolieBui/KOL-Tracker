(async () => {
  const username = 'annhien.boibo';
  const targetUrl = encodeURIComponent(`https://www.tiktok.com/@${username}`);
  const proxyUrl = `https://api.allorigins.win/get?url=${targetUrl}`;
  try {
    const res = await fetch(proxyUrl);
    const text = await res.text();
    console.log(text.slice(0, 500));
  } catch (e) {
    console.error(e);
  }
})();
