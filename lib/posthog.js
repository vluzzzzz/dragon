const { PostHog } = require('posthog-node');

const client = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  flushAt: 1,
  flushInterval: 0,
});

module.exports = client;
