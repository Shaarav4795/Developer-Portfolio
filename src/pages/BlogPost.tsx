import { motion, useScroll } from "framer-motion";
import { useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { blogPosts, getBlogPostBySlug } from "../data/blogPosts";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import "./BlogPost.css";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleBack = () => {
    // Ensure the intro loader is not shown again on return
    sessionStorage.setItem("portfolio-intro-seen", "1");
    // Tell MainContainer to scroll to the blog section after mounting
    sessionStorage.setItem("return-scroll-to", "blog");
    navigate("/");
  };

  if (!post) {
    return (
      <main className="blog-post-page">
        <SEO
          title="Post Not Found | Shaarav Arya"
          description="The requested article could not be found."
          noIndex
        />
        <div className="blog-post-shell">
          <button type="button" className="blog-back-link" data-cursor="disable" onClick={handleBack}>
            ← Back to Home
          </button>
          <section className="blog-not-found" aria-live="polite">
            <h1>Post not found</h1>
            <p>The article you tried to open does not exist or was moved.</p>
            <Link to="/#blog" className="blog-home-btn" data-cursor="disable">
              Explore all sections
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  const postStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `https://shaarav.xyz${post.coverImage}`,
    author: {
      "@type": "Person",
      name: "Shaarav Arya"
    },
    publisher: {
      "@type": "Person",
      name: "Shaarav Arya"
    },
    datePublished: `${post.dateISO}T00:00:00.000Z`,
    dateModified: `${post.dateISO}T00:00:00.000Z`,
    mainEntityOfPage: `https://shaarav.xyz/blog/${post.slug}`
  };

  return (
    <main className="blog-post-page">
      <SEO
        title={`${post.title} | Shaarav Arya`}
        description={post.excerpt}
        image={post.coverImage}
        type="article"
        keywords={[
          post.category,
          "Shaarav Arya blog",
          "frontend article",
          "developer journal"
        ]}
        publishedTime={`${post.dateISO}T00:00:00.000Z`}
        modifiedTime={`${post.dateISO}T00:00:00.000Z`}
        structuredData={postStructuredData}
      />
      <motion.div className="blog-reading-progress" style={{ scaleX: scrollYProgress }} />
      <div className="blog-post-shell">
        <button type="button" className="blog-back-link" data-cursor="disable" onClick={handleBack}>
          ← Back to Home
        </button>

        <motion.article
          className="blog-post-article"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <header className="blog-post-hero">
            <img src={post.coverImage} alt={post.title} className="blog-post-cover" itemProp="image" />
            <div className="blog-post-hero-overlay" />
            <div className="blog-post-hero-content">
              <div className="blog-post-meta" itemProp="about">
                <span>{post.category}</span>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <h1 itemProp="headline">{post.title}</h1>
              <p itemProp="description">{post.excerpt}</p>
            </div>
          </header>

          <section className="blog-post-body" itemProp="articleBody">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
              rehypePlugins={[
                rehypeRaw,
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "append", properties: { className: ["markdown-anchor"] } }],
                rehypeHighlight,
                rehypeKatex
              ]}
            >
              {post.content}
            </ReactMarkdown>
          </section>
        </motion.article>

        <section className="related-posts" aria-labelledby="related-heading">
          <h2 id="related-heading">Keep reading</h2>
          <div className="related-grid">
            {relatedPosts.map((item) => (
              <Link key={item.id} to={`/blog/${item.slug}`} className="related-card" data-cursor="disable">
                <img src={item.coverImage} alt={item.title} />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default BlogPost;
