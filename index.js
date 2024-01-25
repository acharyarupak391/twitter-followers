import { fetchFollowersAndCursor } from "./fetch.js";
import { delay, parseList } from "./util.js";
import { addRows } from "./post-data.js";
import { DEFAULT_FETCH_COUNT, NEXUS_MUTUAL_ID, UPLOAD_THRESHOLD } from "./constants.js";

async function main(initialCursor = "", userId, fetchAll = false, uploadThreshold) {
  const userList = [];
  const totalFetchCount = fetchAll ? 10000000 : DEFAULT_FETCH_COUNT;

  let updatedCursor = initialCursor;
  let totalLength = 0;

  while (userList.length < totalFetchCount) {
    const { cursor, list } = await fetchFollowersAndCursor(
      updatedCursor,
      100,
      userId
    );

    updatedCursor = cursor;
    userList.push(...list);

    totalLength += list.length;
    console.log(`Fetched ${totalLength} users...`);

    if (userList.length >= uploadThreshold) {
      console.log(`\nAdding to google sheets...\nCursor: ${cursor}\n`);

      addRows(parseList(userList));
      userList.splice(0, userList.length);
    }

    if (!cursor || list.length === 0) break;

    // Delay for anywhere between 30 seconds and 35 seconds
    await delay(Math.floor(Math.random() * (5000 + 1)) + 30000);
  }

  if (userList.length) {
    const parsedList = parseList(userList);
    addRows(parsedList);
  }
}

let initialCursor = "";
let userId = NEXUS_MUTUAL_ID;
let fetchAll = false;
let upload = UPLOAD_THRESHOLD

for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i]

  if (arg.startsWith("--cursor")) {
    initialCursor = arg.split("=")[1];
  }

  if (arg.startsWith("--id")) {
    userId = arg.split("=")[1];
  }

  if (arg.startsWith("--all")) {
    fetchAll = true;
  }

  if (arg.startsWith("--upload-count")) {
    upload = arg.split("=")[1];
  }
}

main(initialCursor, userId, fetchAll, upload);
