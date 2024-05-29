function createEnvContents(curlCommand) {
  const tokenNames = {
    cookie: "COOKIE",
    authorization: "BEARER_TOKEN",
    "x-client-uuid": "X_CLIENT_UUID",
    "x-csrf-token": "X_CSRF_TOKEN",
  };

  let envContent = "";

  const headers = curlCommand.split("-H");

  for (const [identifier, varName] of Object.entries(tokenNames)) {
    const header = headers.find((h) => h.includes(`${identifier}: `));

    if (header) {
      const envValue = header
        .split(`${identifier}: `)[1]
        .trim()
        .replace(/'$/, "")
        .replace("Bearer ", "");
      envContent += `${varName}='${envValue}'\n\n`;
    }
  }

  console.log(envContent);
}
