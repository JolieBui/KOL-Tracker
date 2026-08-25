import fs from 'fs';
(async () => {
  const username = 'annhien.boibo';
  const target = encodeURIComponent(`https://urlebird.com/user/${username}/`);
  const url = `https://api.allorigins.win/get?url=${target}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    fs.writeFileSync('urlebird.html', text);
    console.log("Written urlebird.html. Length:", text.length);
  } catch (e) {
    console.error(e);
  }
})();
