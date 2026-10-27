# CAC Agbala Adura website

This is a static, single-page website built with HTML, CSS, and vanilla JavaScript. It has no build step, package manager, backend, or configured payment/form provider.

## Preview locally

From this directory, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Check the site

Run the dependency-free source checks with:

```sh
python3 -m unittest discover -s tests -v
```

## Integrations to configure

- Replace the YouTube and TikTok “Link pending” labels with official profile URLs when supplied.
- Sermon and livestream content currently relies on the church’s Facebook page; no video player or video hosting integration is configured.
- Prayer and contact requests use the listed telephone link. There is no backend form service.
- Giving information is shown for bank transfer; no online payment provider is configured.
- Google Fonts and the embedded Google Maps view require third-party network access.

Keep church schedules, names, contact details, and giving information verified by the church before publishing updates.
