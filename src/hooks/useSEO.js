import { useEffect } from "react";
import { defaultContent } from "../data/defaultContent";

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value) element.setAttribute(key, value);
  });
};

const upsertLink = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value) element.setAttribute(key, value);
  });
};

export const useSEO = (cmsData, lang) => {
  useEffect(() => {
    const seo = cmsData.config.seo || defaultContent.config.seo;
    if (!seo) return;

    const title = seo.title?.[lang];
    const description = seo.description?.[lang];
    const ogTitle = seo.openGraph?.title?.[lang] || title;
    const ogDescription = seo.openGraph?.description?.[lang] || description;
    const twitterTitle = seo.twitter?.title?.[lang] || title;
    const twitterDescription = seo.twitter?.description?.[lang] || description;

    if (title) document.title = title;
    if (description) upsertMeta('meta[name="description"]', { name: "description", content: description });
    if (seo.keywords?.length) upsertMeta('meta[name="keywords"]', { name: "keywords", content: seo.keywords.join(", ") });
    upsertMeta('meta[name="robots"]', { name: "robots", content: `${seo.robots?.index === false ? "noindex" : "index"},${seo.robots?.follow === false ? "nofollow" : "follow"}` });
    if (seo.canonicalUrl) upsertLink('link[rel="canonical"]', { rel: "canonical", href: seo.canonicalUrl });

    if (ogTitle) upsertMeta('meta[property="og:title"]', { property: "og:title", content: ogTitle });
    if (ogDescription) upsertMeta('meta[property="og:description"]', { property: "og:description", content: ogDescription });
    if (seo.openGraph?.image) upsertMeta('meta[property="og:image"]', { property: "og:image", content: seo.openGraph.image });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: seo.openGraph?.type || "website" });

    if (twitterTitle) upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: twitterTitle });
    if (twitterDescription) upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: twitterDescription });
    if (seo.twitter?.image) upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: seo.twitter.image });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: seo.twitter?.card || "summary_large_image" });

    if (seo.icons?.favicon) upsertLink('link[rel="icon"]', { rel: "icon", href: seo.icons.favicon });
    if (seo.icons?.appleTouchIcon) upsertLink('link[rel="apple-touch-icon"]', { rel: "apple-touch-icon", href: seo.icons.appleTouchIcon });
    if (seo.icons?.themeColor) upsertMeta('meta[name="theme-color"]', { name: "theme-color", content: seo.icons.themeColor });
  }, [cmsData.config.seo, lang]);
};
