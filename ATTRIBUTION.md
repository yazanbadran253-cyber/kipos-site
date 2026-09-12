# App Store attribution

Every website App Store link has a `data-app-campaign` value. The convention is:

`website_<page>_<placement>`

Current examples include `website_home_hero`, `website_compare_growit_cta`,
`website_compare_planta_cta`, `website_guide_growth_cta`, and
`website_guide_balcony_cta`.

Use the same short source names for future links:

- Homepage: `website_home_<placement>`
- GrowIt comparison: `website_compare_growit_<placement>`
- Planta comparison: `website_compare_planta_<placement>`
- PictureThis comparison: `website_compare_picturethis_<placement>`
- Alternative pages: `website_alternative_<competitor>_<placement>`
- Guides: `website_guide_<topic>_<placement>`
- Timeline tool: `website_tool_timeline_<placement>`
- Instagram: `social_instagram_<campaign>`
- TikTok: `social_tiktok_<campaign>`
- Reddit: `social_reddit_<campaign>`
- Creator partners: `creator_<partner>_<campaign>`

## Activate Apple campaign links

Apple campaign attribution requires both a provider token (`pt`) and a campaign
token (`ct`). Generate the provider token in App Store Connect under Analytics,
then put it in `APP_STORE_PROVIDER_TOKEN` in `assets/js/site.js`. The script will
add `pt`, `ct`, and `mt=8` to links that have `data-app-campaign`.

Do not invent the provider token. Until a real token is supplied, the links stay
as normal App Store links and no Apple campaign attribution is claimed.

Apple reports campaign impressions, product page views, downloads, usage, sales,
and subscriptions when privacy thresholds are met. First-time downloads are
attributed when they occur within 24 hours after the campaign-link click. Small
groups may be withheld or combined, and last-click rules apply when a person uses
more than one campaign link.

The static site does not currently run web analytics. It therefore cannot count
landing-page visits or outbound clicks on its own. Add a small privacy-focused
analytics service only after choosing a provider and updating the privacy policy.

Source: https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links
