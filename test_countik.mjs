(async () => {
  const username = 'annhien_boiboi';
  const target = `https://countik.com/api/userinfo?username=${username}`;
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      console.log("COUNTIK SUCCESS! Content:", json.contents);
    } else {
      console.log("COUNTIK FAILED:", res.status, res.statusText);
    }
  } catch (e) {
    console.error("Error fetching countik:", e);
  }
})();
