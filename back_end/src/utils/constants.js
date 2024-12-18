const { env } = require("../config/environment")
const WHITELIST_DOMAINS = ["http://localhost:8080"]
const WEBSITE_DOMAIN =
  env.BUILD_MODE === "production"
    ? env.WEBSITE_DAMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT
const DEFAULT_PAGE = 1
const DEFAULT_ITEMS_PAGE = 12
module.exports = {
  WHITELIST_DOMAINS,
  WEBSITE_DOMAIN,
  DEFAULT_PAGE,
  DEFAULT_ITEMS_PAGE
}
