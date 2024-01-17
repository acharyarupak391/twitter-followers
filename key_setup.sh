#!/bin/bash

FILE=.env

function get_env_var() {
  local var_name="$1"

  # Check if the file exists
  if [ -f "$FILE" ]; then
    # Check if the variable exists in the $FILE file
    if grep -q "^$var_name=" "$FILE"; then
      var_value=$(grep "^$var_name=" "$FILE" | cut -d "=" -f 2)
    else
      # The variable does not exist in the $FILE file, so get it from the system's environment variables
      var_value=$(env | grep "^$var_name=" | cut -d "=" -f 2)
    fi
  else
    # The file does not exist, so get the variable from the system's environment variables
    var_value=$(env | grep "^$var_name=" | cut -d "=" -f 2)
  fi

  echo $var_value
}

encryption_key=$(get_env_var ENCRYPTION_KEY)

# Check if the -d argument was passed
if [[ $1 == "-d" ]]; then # The -d argument was passed
  # cmd="openssl enc -aes-256-cbc -d -in secret/key.json.enc -out secret/key.json -k $encryption_key"   #decryption
  cmd="openssl enc -aes-256-cbc -d -pbkdf2 -in secret/key.json.enc -out secret/key.json -k $encryption_key"
else
  # cmd="openssl enc -aes-256-cbc -in secret/key.json -out secret/key.json.enc -k $encryption_key"    #encryption
  cmd="openssl enc -aes-256-cbc -pbkdf2 -salt -in secret/key.json -out secret/key.json.enc -k $encryption_key"
fi

# Execute the command
command $cmd

# Check the exit status
if [[ $? -ne 0 ]]; then
  echo "Error executing the command"
fi