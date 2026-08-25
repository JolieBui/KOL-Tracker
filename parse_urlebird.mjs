import fs from 'fs';
(async () => {
  const username = 'annhien.boibo';
  const target = encodeURIComponent(`https://urlebird.com/user/${username}/`);
  const url = `https://api.allorigins.win/get?url=${target}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    const html = json.contents;
    fs.writeFileSync('urlebird.html', html);
    console.log("Written urlebird.html. Lines count:", html.split('\n').length);
  } catch (e) {
    console.error(e);
  }
})();
