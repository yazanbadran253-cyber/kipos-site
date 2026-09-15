# App Store attribution

Every website App Store link has a `data-app-campaign` value. The convention is:

`<page>_<placement>`

Current examples include `home_hero`, `cmp_growit_cta`, `cmp_planta_cta`,
`guide_growth_cta`, and `guide_balcony_cta`.

**Apple caps the campaign token at 30 characters**, and `site.js` prefixes it
with the landing page's `utm_source` when there is one (`gads_alt_planta_card`
for a Google Ads click). So keep page tokens at 25 characters or fewer, and
keep `utm_source` values to four letters (`gads`).

Use the same short source names for future links:

- Homepage: `home_<placement>`
- GrowIt comparison: `cmp_growit_<placement>`
- Planta comparison: `cmp_planta_<placement>`
- PictureThis comparison: `cmp_picturethis_<placement>`
- Alternative pages: `alt_<competitor>_<placement>`
- Guides: `guide_<topic>_<placement>`
- Timeline tool: `tool_timeline_<placement>`
- Instagram: `social_instagram_<campaign>`
- TikTok: `social_tiktok_<campaign>`
- Reddit: `social_reddit_<campaign>`
- Creator partners: `creator_<partner>_<campaign>`

## Activate Apple campaign links

Apple campaign attribution requires both a provider token (`pt`) and a campaign
token (`ct`). The provider token identifies the developer account and never
changes; it is `129236192`, generated in App Store Connect → Kipos → Analytics →
Acquisition → Campaigns on 2026-09-15, and lives in `APP_STORE_PROVIDER_TOKEN`
in `assets/js/site.js`. The script adds `pt`, `ct`, and `mt=8` to links that
have `data-app-campaign`. Downloads per token show in that same Campaigns view.

Apple reports campaign impressions, product page views, downloads, usage, sales,
and subscriptions when privacy thresholds are met. First-time downloads are
attributed when they occur within 24 hours after the campaign-link click. Small
groups may be withheld or combined, and last-click rules apply when a person uses
more than one campaign link.

The static site does not currently run web analytics. It therefore cannot count
landing-page visits or outbound clicks on its own. Add a small privacy-focused
analytics service only after choosing a provider and updating the privacy policy.

Source: https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links
