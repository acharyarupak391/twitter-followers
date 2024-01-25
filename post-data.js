import { google } from "googleapis";
import fs from "fs";
import path from "path";

const addRows = async (parsedList) => {
  const filePath = path.join(process.cwd(), "secret", "key.json");
  const serviceAccount = JSON.parse(fs.readFileSync(filePath));

  // Define the scopes for the Google Sheets API
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

  // Authenticate the service account
  const auth = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    scopes
  );

  const service = google.sheets({ version: "v4", auth });
  // Spreadsheet ID - from the URL of your Google Sheets document
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Sheet name
  const sheet = process.env.SHEET_NAME;

  // Input option - let's say we want the input to be parsed
  const valueInputOption = "USER_ENTERED";

  // Values to be inserted - a 2D array of values
  // Convert parsedList to a 2D array of values
  const values = parsedList.map((item) => [
    item.name,
    item.username,
    item.verified,
    item.profile_link,
    item.location,
    item.followers_count,
    item.friends_count,
    item.profile_image_url,
    item.description,
    item.created_at,
    item.media_count,
    item.statuses_count,
  ]);

  const resource = {
    values,
  };

  try {
    const result = await service.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheet}!A3`,
      valueInputOption,
      resource,
    });
    if (result.statusText === "OK") return true;
  } catch (err) {
    // TODO (Developer) - Handle exception
    console.log("Error in posting data to google api: ", err);
  }

  return false;
};

export { addRows };
