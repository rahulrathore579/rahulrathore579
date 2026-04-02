import { useEffect } from 'react';

type SeoOptions = {
  title: string;
  description: string;
  canonicalPath: string;
};

const SITE_URL = 'https://rahulrathore579.vercel.app';

function upsertMeta(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertPropertyMeta(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function useSeo({ title, description, canonicalPath }: SeoOptions) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', 'index, follow');
    upsertCanonical(canonicalUrl);

    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:url', canonicalUrl);

    upsertPropertyMeta('twitter:title', title);
    upsertPropertyMeta('twitter:description', description);
    upsertPropertyMeta('twitter:url', canonicalUrl);
  }, [title, description, canonicalPath]);
}
