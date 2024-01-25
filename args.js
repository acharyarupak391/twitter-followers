import { Command } from "commander";
import {
  DEFAULT_FETCH_COUNT,
  MIN_DELAY,
  NEXUS_MUTUAL_ID,
  UPLOAD_THRESHOLD,
} from "./constants.js";

const program = new Command();

program
  .option("--cursor <value>", "Set the cursor value", "")
  .option("--user-id <value>", "Set twitter user id", NEXUS_MUTUAL_ID)
  .option("--all", "fetch all the followers?", false)
  .option(
    "--upload-count <value>",
    "Set upload threshold(Upload to google sheets after how many are fetched?)",
    UPLOAD_THRESHOLD
  )
  .option(
    "--min-delay <value>",
    "Set minimum delay before making each request",
    MIN_DELAY
  )
  .option(
    "--fetch-count <value>",
    "Set total followers to fetch",
    DEFAULT_FETCH_COUNT
  )
  .parse(process.argv);

const options = program.opts();

const cursor = options.cursor;
const userId = options.userId;
const fetchAll = options.all;
const uploadThreshold = Number(options.uploadCount);
const minDelay = Number(options.minDelay);
const fetchCount = Number(options.fetchCount);

const args = {
  cursor,
  userId,
  fetchAll,
  uploadThreshold,
  minDelay,
  fetchCount,
};

export { args };
