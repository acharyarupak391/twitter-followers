import fetch from "node-fetch";

import { config } from "dotenv";
import { createUrl } from "./util.js";
import {
  MAX_FETCH_COUNT,
  graphqlId,
  verifiedOnlyGraphqlId,
} from "./constants.js";

config();

const params = (userId, cursor, count) => {
  const _params = {
    variables: {
      userId,
      count: count || MAX_FETCH_COUNT,
      includePromotedContent: false,
    },
    features: {
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: false,
      tweet_awards_web_tipping_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
      rweb_video_timestamps_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_media_download_video_enabled: false,
      responsive_web_enhance_cards_enabled: false,
    },
  };

  if (cursor) _params.variables.cursor = cursor;

  return _params;
};

const onlyVerified = process.env.VERIFIED_ONLY?.toLowerCase() === "true";

let url = `https://twitter.com/i/api/graphql/${graphqlId}/Followers?`;

if (onlyVerified)
  url = `https://twitter.com/i/api/graphql/${verifiedOnlyGraphqlId}/BlueVerifiedFollowers?`;

const bearerToken = process.env.BEARER_TOKEN;
const cookie = process.env.COOKIE;
const clientUUID = process.env.X_CLIENT_UUID;
const csfrToken = process.env.X_CSRF_TOKEN;

async function fetchFollowersAndCursor(cursor, count, twitterId) {
  const fullUrl = new URL(createUrl(params(twitterId, cursor, count)), url);

  try {
    const headers = {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
      Cookie: cookie,
      "x-client-uuid": clientUUID,
      "x-csrf-token": csfrToken,
    };

    const response = await fetch(fullUrl, { headers });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.ok}\n`);
    }

    const data = await response.json();
    const instructions = data.data.user.result.timeline.timeline.instructions;
    const entries = instructions.find((i) => i.entries).entries;

    const usersOnly = entries.filter(
      (entry) => entry.content.entryType === "TimelineTimelineItem"
    );
    const bottomCursor = entries.find(
      (entry) =>
        entry.content.entryType === "TimelineTimelineCursor" &&
        entry.content.cursorType === "Bottom"
    )?.content.value;

    if (bottomCursor.startsWith("0|")) {
      return {
        cursor: "",
        list: usersOnly,
      };
    }

    return {
      cursor: bottomCursor,
      list: usersOnly,
    };
  } catch (err) {
    // console.error(err, "\nLast cursor: ", cursor);
    console.error(err);
  }
  return { cursor: "", list: [] };
}

export { fetchFollowersAndCursor };
