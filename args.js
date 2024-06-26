import { Command } from "commander";
import {
  DEFAULT_FETCH_COUNT,
  DEFAULT_FILENAME,
  MIN_DELAY,
  RANDOMIZE_OFFSET_VALUE,
  UPLOAD_THRESHOLD,
} from "./constants.js";

const program = new Command();

program
  .option("--cursor <value>", "Set the cursor value", "")
  .option("--user-id <value>", "Set twitter user id")
  .option(
    "--fetch-count <value>",
    "Set total followers to fetch",
    DEFAULT_FETCH_COUNT
  )
  .option("--all", "fetch all the followers?", false)
  .option(
    "--upload-count <value>",
    "Set upload threshold(Upload to google sheets or save to file after how many are fetched?)",
    UPLOAD_THRESHOLD
  )
  .option(
    "--min-delay <value>",
    "Set minimum delay before making each request",
    MIN_DELAY
  )
  .option(
    "--save-to-sheets",
    "Save the output to google sheets? (will override --csv-filename option)",
    false
  )
  .option(
    "--csv-filename <value>",
    "Set the output filename for the CSV (will be ignored if --save-to-google-sheets option is set to true)",
    DEFAULT_FILENAME
  )
  .option(
    "--fields-to-save <value>",
    "Fields to save in the CSV. Comma separated list of fields",
    "name,username,verified,profile_link,location,followers_count,friends_count,profile_image_url,description,created_at,media_count,statuses_count"
  )
  .option(
    "--random-offset <value>",
    "Additional random delay value while fetching followers",
    RANDOMIZE_OFFSET_VALUE
  )
  .parse(process.argv);

const options = program.opts();

const cursor = options.cursor;
const userId = options.userId;
const fetchAll = options.all;
const uploadThreshold = Number(options.uploadCount);
const minDelay = Number(options.minDelay);
const fetchCount = Number(options.fetchCount);
const saveToGoogleSheets = Boolean(options.saveToSheets);
const csvFilename = options.csvFilename;
const fieldsToSave = options.fieldsToSave.split(",");
const randomOffset = options.randomOffset;

const args = {
  cursor,
  userId,
  fetchAll,
  uploadThreshold,
  minDelay,
  fetchCount,
  saveToGoogleSheets,
  csvFilename,
  fieldsToSave,
  randomOffset,
};

export { args };
