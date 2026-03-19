import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { config } from "../config";

type StructuredData = Record<string, unknown>;

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: StructuredData | StructuredData[];
}

const SITE_URL = "https://shaarav.xyz";

const toAbsoluteUrl = (value: string) => {
  return new URL(value, SITE_URL).toString();
};

const SEO = ({
  title,
  description,
  image,
  type = "website",
  keywords,
  noIndex = false,
  publishedTime,
  modifiedTime,
  structuredData
}: SEOProps) => {
  const { pathname, search } = useLocation();
  const canonicalPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const canonicalUrl = toAbsoluteUrl(`${canonicalPath}${search}`);
  const imageUrl = toAbsoluteUrl(image || config.developer.photo);
  const robotDirective = noIndex ? "noindex, nofollow" : "index, follow";
  const keywordContent = keywords?.filter(Boolean).join(", ") || undefined;
  const structuredDataItems = Array.isArray(structuredData)
    ? structuredData
    : structuredData
      ? [structuredData]
      : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotDirective} />
      {keywordContent && <meta name="keywords" content={keywordContent} />}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={config.developer.fullName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {structuredDataItems.map((item, index) => (
        <script key={`structured-data-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
