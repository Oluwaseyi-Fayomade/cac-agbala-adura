"""Dependency-free structural checks for the static church website."""

from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
HTML_FILE = ROOT / "index.html"
CSS_FILE = ROOT / "style.css"
JS_FILE = ROOT / "script.js"


class SiteMarkup(HTMLParser):
    VOID_ELEMENTS = {
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.ids = []
        self.hash_links = []
        self.local_assets = []
        self.images = []
        self.external_blank_links = []
        self.inline_styles = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a":
            href = attrs.get("href", "")
            if href.startswith("#") and len(href) > 1:
                self.hash_links.append(href[1:])
            if attrs.get("target") == "_blank":
                self.external_blank_links.append((href, attrs.get("rel", "")))
        if tag == "img":
            self.images.append(attrs)
        if "style" in attrs:
            self.inline_styles.append(attrs["style"])

        asset_attr = {"img": "src", "script": "src", "link": "href", "iframe": "src"}.get(tag)
        if asset_attr:
            value = attrs.get(asset_attr, "")
            parsed = urlsplit(value)
            if value and not parsed.scheme and not value.startswith("#"):
                self.local_assets.append(parsed.path)

        if tag not in self.VOID_ELEMENTS:
            self.stack.append((tag, self.getpos()))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID_ELEMENTS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag in self.VOID_ELEMENTS:
            return
        if not self.stack:
            self.errors.append((self.getpos(), f"unexpected </{tag}>"))
            return
        opened, opened_at = self.stack[-1]
        if opened == tag:
            self.stack.pop()
            return
        self.errors.append((self.getpos(), f"</{tag}> encountered while <{opened}> from {opened_at} is open"))
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break


class SiteChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = HTML_FILE.read_text(encoding="utf-8")
        cls.css = CSS_FILE.read_text(encoding="utf-8")
        cls.js = JS_FILE.read_text(encoding="utf-8")
        cls.markup = SiteMarkup()
        cls.markup.feed(cls.html)

    def test_html_elements_are_balanced_and_ids_unique(self):
        self.assertEqual(self.markup.errors, [])
        self.assertEqual(self.markup.stack, [])
        self.assertEqual(len(self.markup.ids), len(set(self.markup.ids)))

    def test_internal_links_and_local_assets_resolve(self):
        ids = set(self.markup.ids)
        broken_links = [anchor for anchor in self.markup.hash_links if anchor not in ids]
        missing_assets = [asset for asset in self.markup.local_assets if not (ROOT / asset).is_file()]
        self.assertEqual(broken_links, [])
        self.assertEqual(missing_assets, [])

    def test_images_have_alt_and_external_tabs_are_safe(self):
        self.assertTrue(all("alt" in image for image in self.markup.images))
        safe_rel = {"noopener", "noreferrer"}
        unsafe = [href for href, rel in self.markup.external_blank_links if not safe_rel.issubset(set(rel.split()))]
        self.assertEqual(unsafe, [])

    def test_inline_and_stylesheet_background_images_resolve(self):
        styles = [self.css, *self.markup.inline_styles]
        missing = []
        for style in styles:
            for value in re.findall(r"url\(([^)]+)\)", style):
                value = value.strip().strip("\"'")
                parsed = urlsplit(value)
                if not parsed.scheme and not value.startswith("data:") and not (ROOT / parsed.path).is_file():
                    missing.append(value)
        self.assertEqual(missing, [])

    def test_css_is_balanced_and_respects_reduced_motion(self):
        css = re.sub(r"/\*.*?\*/", "", self.css, flags=re.S)
        css = re.sub(r"\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*'", "", css)
        self.assertEqual(css.count("{"), css.count("}"))
        self.assertIn("prefers-reduced-motion: reduce", self.css)

    def test_no_fake_social_destinations_or_unsafe_dom_insertion(self):
        self.assertNotRegex(self.html, r"(?:your-church-channel|your-church-account|example\.com)")
        self.assertNotRegex(self.js, r"\b(?:eval|innerHTML|outerHTML)\b")


if __name__ == "__main__":
    unittest.main()
