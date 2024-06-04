# Scrape twitter followers

## Setup environment variables
  - Go to your browser and open the developer console and go to the network tab. 
  - Go to the followers page of **any** user(eg. https://twitter.com/elonmusk/followers). 
  - Login to your twitter account if you aren't.
  - Look for the request that has the followers data(you can filter by typing `Followers?variables`). 
    - *(If you can't find it, try refreshing the page and looking again)*
  - Using `createEnvContents` util function in `env-util.js` file:
    - Right click on the request and click on `Copy` -> `Copy as cURL`.
    - Pass the copied cURL command as an argument to the `createEnvContents` function. (Make sure to stringify the cURL command before passing it to the function)
    - The function will return the environment variables that you need to add to the `.env` file.
  - Manually:
    - Click on the request and go to the `Headers` tab and go to the `Request Headers` section.
    - Copy the `Cookie`, `X-Csrf-Token`, `X-Client-Uuid` and `Authorization`(without the `Bearer` prefix) headers.
    - Then create a `.env` file in the root of the project and add copied headers to the file as following environment variables.
      - `BEARER_TOKEN`
      - `COOKIE`
      - `X_CLIENT_UUID`
      - `X_CSRF_TOKEN`
  - You can set `VERIFIED_ONLY` variable to `true` if you want to get verified followers **only**.

  - ### If you want to store the data in google sheets 
    - Set `--save-to-sheets` to `true` while running the script. 
    - Go to google cloud console and create a new project.
    - Enable the google sheets API.
    - Create a new service account and download the credentials file.
    - Move the credentials file to the `secret` folder and rename it to `key.json`.
    - Create a new spreadsheet and add the service account email as an editor to the spreadsheet.
    - Copy the spreadsheet id and the sheet name and add them to the `.env` file as `SPREADSHEET_ID` and `SHEET_NAME` respectively.

## Usage
- `yarn start --user-id=<user-id>`: Scrape the followers of the user with the given user id.

- ### CLI options
  - Install the dependencies by running `yarn install`. 
  - `yarn start --help`: Show the help message.
    ```
    Options:
      --cursor <value>          Set the cursor value (default: "")
      --user-id <value>         Set twitter user id
      --fetch-count <value>     Set total followers to fetch (default: 1000)
      --all                     fetch all the followers? (default: false)
      --upload-count <value>    Set upload threshold(Upload to google sheets or save to file after how many are fetched?) (default: 500)
      --min-delay <value>       Set minimum delay before making each request (default: 45000)
      --save-to-sheets          Save the output to google sheets? (will override --csv-filename option) (default: false)
      --csv-filename <value>    Set the output filename for the CSV (will be ignored if --save-to-google-sheets option is set to true) (default: "export.csv")
      --fields-to-save <value>  Fields to save in the CSV. Comma separated list of fields (default:
                                "name,username,verified,profile_link,location,followers_count,friends_count,profile_image_url,description,created_at,media_count,statuses_count")
      --random-offset <value>   Additional random delay value while fetching followers (default: 5000)
      -h, --help                display help for command
    ```