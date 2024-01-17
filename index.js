import { fetchFollowersAndCursor } from "./fetch.js";
import { delay, parseList } from "./util.js";
import { addRows } from "./post-data.js";

async function main() {
  const userList = [];
  const totalFetchCount = 500;

  let updatedCursor = "";

  while (userList.length < totalFetchCount) {
    const count = totalFetchCount - userList.length;
    const { cursor, list } = await fetchFollowersAndCursor(
      updatedCursor,
      count
    );

    updatedCursor = cursor;
    userList.push(...list);

    if (!cursor || list.length === 0) break;

    // Delay for 5 seconds
    await delay(5000);
  }

  const parsedList = parseList(userList);

  addRows(parsedList);
}
main();
