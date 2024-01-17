function createUrl(obj) {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      if (typeof obj[p] === "object") {
        str.push(
          encodeURIComponent(p) +
            "=" +
            encodeURIComponent(JSON.stringify(obj[p]))
        );
      } else {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  return "?" + str.join("&");
}

function parseUrl(url) {
  let params = {};
  let parts = url.split("?");
  if (parts.length > 1) {
    let pairs = parts[1].split("&");
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split("=");
      let key = decodeURIComponent(pair[0]);
      let value = decodeURIComponent(pair[1]);
      try {
        params[key] = JSON.parse(value);
      } catch (e) {
        params[key] = value;
      }
    }
  }
  return params;
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const parseList = (list) => {
  const parsedList = list.map((item) => {
    const user = item.content.itemContent.user_results.result.legacy;
    return {
      name: user.name || "N/A",
      username: user.screen_name || "N/A",
      verified: user.verified ? "Yes" : "No",
      profile_image_url: user.profile_image_url_https,
      description: user.description || "N/A",
      created_at: user.created_at || "N/A",
      location: user.location || "N/A",
      followers_count: user.followers_count || "N/A",
      friends_count: user.friends_count || "N/A",
      media_count: user.media_count || "N/A",
      statuses_count: user.statuses_count || "N/A",
    };
  });

  return parsedList;
};

export { createUrl, parseUrl, delay, parseList };
