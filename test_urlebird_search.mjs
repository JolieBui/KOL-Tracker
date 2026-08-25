(async () => {
  const q = 'annhien.boibo';
  const target = encodeURIComponent(`https://urlebird.com/search/?q=${q}`);
  const url = `https://api.allorigins.win/get?url=${target}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const html = json.contents;
      console.log("Search Success! Length:", html.length);
      // Let's write the HTML to check it
      import('fs').then(fs => {
        fs.writeFileSync('urlebird_search.html', html);
        console.log("Saved urlebird_search.html");
      });
    } else {
      console.log("Search Failed:", res.status);
    }
  } catch (e) {
    console.error(e);
  }
})();
