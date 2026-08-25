(async () => {
  const username = 'annhien.boibo';
  const url = `https://www.tikwm.com/api/user/info?unique_id=${username}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      console.log("TIKWM SUCCESS!");
      console.log(json.data ? {
        nickname: json.data.user.nickname,
        avatar: json.data.user.avatarThumb,
        followers: json.data.stats.followerCount,
        hearts: json.data.stats.heartCount,
        diggCount: json.data.stats.diggCount,
        videoCount: json.data.stats.videoCount
      } : json);
    } else {
      console.log("TIKWM FAILED:", res.status, res.statusText);
    }
  } catch (e) {
    console.error("Error fetching tikwm:", e);
  }
})();
