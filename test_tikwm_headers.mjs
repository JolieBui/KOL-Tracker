(async () => {
  const username = 'annhien.boibo';
  const url = `https://www.tikwm.com/api/user/info?unique_id=${username}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const json = await res.json();
      console.log("TIKWM SUCCESS!");
      console.log(json.data ? {
        nickname: json.data.user.nickname,
        avatar: json.data.user.avatarThumb,
        followers: json.data.stats.followerCount,
        hearts: json.data.stats.heartCount
      } : json);
    } else {
      console.log("TIKWM FAILED:", res.status, res.statusText);
    }
  } catch (e) {
    console.error("Error fetching tikwm:", e);
  }
})();
