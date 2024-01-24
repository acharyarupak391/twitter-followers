import { fetchFollowersAndCursor } from "./fetch.js";
import { delay, parseList } from "./util.js";
import { addRows } from "./post-data.js";

const DEFAULT_FETCH = 1000;
const UPLOAD_THRESHOLD = 1000;

async function main(initialCursor = "", userId, fetchAll = false) {
  const userList = [];
  const totalFetchCount = fetchAll ? 10000000 : DEFAULT_FETCH;

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

    if (userList.length >= UPLOAD_THRESHOLD) {
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
let userId = "";
let fetchAll = false;

for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i].startsWith("--cursor")) {
    initialCursor = process.argv[i].split("=")[1];
  }

  if (process.argv[i].startsWith("--id")) {
    userId = process.argv[i].split("=")[1];
  }

  if (process.argv[i].startsWith("--all")) {
    fetchAll = true;
  }
}

main(initialCursor, userId, fetchAll);
