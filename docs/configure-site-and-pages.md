# Configure a site and add pages

Use this guide when implementing shared site values, shared metadata, or a new page. Approved site values belong in the configuration below; approved page copy and image choices come from the task or existing content.

## Configure shared values

- Set Astro's `site` in [astro.config.mjs](../astro.config.mjs) to the approved absolute production URL. The layout reads `Astro.site`; preview and development hosts do not supply this value.
- Set `siteConfig.name` in [src/site-config.ts](../src/site-config.ts) to the approved site name. It supplies the title suffix and `og:site_name`.
- Set `siteConfig.language` in the same module to the site's HTML language tag. The template default matches its English sample content. This setting does not configure multilingual routing.
- The layout links to `favicon.svg` and `favicon.ico` in `public/`; replace those files to change the favicon.

The template leaves the production URL and site name unset. A build still succeeds and logs warnings for missing values. Without a production URL, canonical and `og:url` tags are omitted. Without a site name, the title contains only the page title and `og:site_name` is omitted. Use approved project facts rather than adding placeholder business values.

When these values change, update the homepage smoke expectations and the build tests that assert the template's unset site values to match the new configuration and content.

The same production URL supplies the generated sitemap and robots.txt sitemap reference. See [Configure the sitemap and robots.txt](configure-sitemap-and-robots.md) for build behavior and page exclusions.

## Add a page

Create an `.astro` file under `src/pages/`, following [Astro's file-based routing](https://docs.astro.build/en/guides/routing/). Import [BaseLayout](../src/layouts/BaseLayout.astro) using the relative path appropriate to the new page.

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";

const title = "About";
const description = "Learn about this project.";
---

<BaseLayout title={title} description={description}>
  <main>
    <h1>{title}</h1>
    <p>{description}</p>
  </main>
</BaseLayout>
```

Replace the example copy with the approved page content. The layout owns the HTML document, shared styles, and head metadata; place page content, landmarks, and headings in its default slot.

| Layout input  | Required | Purpose                                                                |
| ------------- | -------- | ---------------------------------------------------------------------- |
| `title`       | Yes      | Page title; the configured site name is appended when present          |
| `description` | Yes      | Page description for standard and social metadata                      |
| `image`       | No       | `{ src: string; alt: string }` for the social-sharing image; see below |
| Default slot  | Yes      | Rendered page content                                                  |

The canonical and `og:url` values combine the configured production URL with the page path in its no-trailing-slash form, such as `/about`, with `/` for the homepage; they exclude query parameters and fragments. Follow the repository [URL conventions](../coding-standards.md#urls-and-metadata).

### Social-sharing images

Supply the optional `image` input as `{ src, alt }` with the approved image source and alternative text. Files in `public/` use a root-relative path; an imported Astro image uses its `.src` property; externally hosted images use an absolute HTTP(S) URL. Relative image URLs need a configured production URL to become absolute social metadata URLs. An absolute image URL can be used even before the production URL is configured. When no image can be resolved, image metadata is omitted.

The layout emits Open Graph metadata and a `twitter:card` value from the page inputs. Twitter cards use the Open Graph title, description, and image.

## Verify changes

Run the applicable checks in [CONTRIBUTING.md](../CONTRIBUTING.md#validate-your-change). Playwright supplies the reserved test domain through its server command; it is a test input and must not become the project's production URL.
