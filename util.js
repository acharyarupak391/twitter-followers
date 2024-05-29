import fs from "fs";

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

const parseList = (list, fieldsArray) => {
  const parsedList = list
    .map((item) => {
      const user = item.content.itemContent.user_results?.result?.legacy;
      if (!user) {
        return;
      }

      const verified =
        item.content.itemContent.user_results.result.is_blue_verified;

      const obj = {
        name: user.name || "N/A",
        username: user.screen_name || "N/A",
        verified: verified ? "Yes" : "No",
        profile_link: `https://twitter.com/${user.screen_name}`,
        location: user.location || "N/A",
        followers_count: user.followers_count ?? "N/A",
        friends_count: user.friends_count ?? "N/A",
        profile_image_url: user.profile_image_url_https,
        description: user.description || "N/A",
        created_at: user.created_at || "N/A",
        media_count: user.media_count ?? "N/A",
        statuses_count: user.statuses_count ?? "N/A",
      };

      Object.keys(obj).map((key) => {
        if (!fieldsArray.includes(key)) {
          delete obj[key];
        }
      });

      return obj;
    })
    .filter(Boolean);

  return parsedList;
};

function keyToTitle(key) {
  return key
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const appendDataToCSV = (list, filename) => {
  // create file if it doesn't exist
  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, "");
  }

  const separator = ",";

  let csv = list.map((row) => {
    return Object.values(row)
      .map((value) => {
        if (typeof value === "string") {
          return value.includes(separator) || value.includes("\n")
            ? `"${value}"`
            : value;
        }
        return value;
      })
      .join(separator);
  });

  // check if file is empty and append headers
  if (fs.readFileSync(filename, "utf8").length === 0) {
    const capitalizedKeys = Object.keys(list[0]).map((key) => keyToTitle(key));
    csv.unshift(capitalizedKeys.join(separator));
  }

  csv = csv.join("\n") + "\n";

  fs.appendFile(filename, csv, (err) => {
    if (err) throw err;
  });
};

export { createUrl, parseUrl, delay, parseList, appendDataToCSV };
