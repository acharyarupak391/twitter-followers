import { fetchFollowersAndCursor } from "./fetch.js";
import { delay, parseList } from "./util.js";
import { addRows } from "./post-data.js";
import { args } from "./args.js";

async function main(
  initialCursor,
  userId,
  fetchAll,
  fetchCount,
  uploadThreshold,
  minDelay
) {
  const userList = [];
  const totalFetchCount = fetchAll ? 10000000 : fetchCount;

  let updatedCursor = initialCursor;
  let totalFetched = 0;

  while (totalFetched < totalFetchCount) {
    const { cursor, list } = await fetchFollowersAndCursor(
      updatedCursor,
      100,
      userId
    );

    updatedCursor = cursor;
    userList.push(...list);

    totalFetched += list.length;
    console.log(`Fetched ${totalFetched} users...`);

    if (userList.length >= uploadThreshold) {
      console.log(`\nAdding to google sheets...\nCursor: ${cursor}\n`);

      addRows(parseList(userList));
      userList.splice(0, userList.length);
    }

    if (!cursor || list.length === 0 || totalFetched >= totalFetchCount) break;

    const delayInMs = Math.floor(Math.random() * (5000 + 1)) + minDelay;
    await delay(delayInMs);
  }

  if (userList.length) {
    const parsedList = parseList(userList);
    addRows(parsedList);
  }
}

const { cursor, userId, fetchAll, fetchCount, uploadThreshold, minDelay } =
  args;

main(cursor, userId, fetchAll, fetchCount, uploadThreshold, minDelay);
