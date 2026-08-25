(async () => {
  const username = 'annhien_boiboi';
  const target = encodeURIComponent(`https://urlebird.com/user/${username}/`);
  const url = `https://api.allorigins.win/get?url=${target}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const html = json.contents;
      console.log("Success! Length:", html.length);
      // Let's write the html to check it
      import('fs').then(fs => {
        fs.writeFileSync('urlebird_profile.html', html);
        console.log("Saved urlebird_profile.html");
      });
    } else {
      console.log("Failed:", res.status);
    }
  } catch (e) {
    console.error(e);
  }
})();
