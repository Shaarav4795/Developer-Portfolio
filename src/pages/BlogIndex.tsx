import { motion } from "framer-motion";
import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { blogPosts } from "../data/blogPosts";
import "./BlogIndex.css";

const BlogIndex = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const blogListStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Shaarav Arya Journal",
    url: "https://shaarav.xyz/blog",
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.dateISO,
      url: `https://shaarav.xyz/blog/${post.slug}`,
      image: `https://shaarav.xyz${post.coverImage}`,
      description: post.excerpt
    }))
  };

  return (
    <main className="blog-index-page">
      <SEO
        title="All Blog Posts | Shaarav Arya"
        description="Read every article from Shaarav Arya on frontend engineering, 3D web experiences, product workflows, and shipping process."
        image={blogPosts[0]?.coverImage}
        keywords={[
          "Shaarav Arya blog",
          "frontend engineering blog",
          "three.js articles",
          "developer journal",
          "product building notes"
        ]}
        structuredData={blogListStructuredData}
      />
      <div className="blog-index-shell">
        <Link to="/#blog" className="blog-index-back" data-cursor="disable">
          ← Back to Journal Section
        </Link>

        <header className="blog-index-header">
          <h1>All Posts</h1>
          <p>Browse every journal entry, including older notes not shown on the homepage grid.</p>
        </header>

        <section className="blog-index-grid" aria-label="All blog posts">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              className="blog-index-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
            >
              <Link to={`/blog/${post.slug}`} className="blog-index-cover" data-cursor="disable">
                <img src={post.coverImage} alt={post.title} loading="lazy" />
              </Link>
              <div className="blog-index-content">
                <div className="blog-index-meta">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2>
                  <Link to={`/blog/${post.slug}`} data-cursor="disable">
                    {post.title}
                  </Link>
                </h2>
                <p>{post.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default BlogIndex;
