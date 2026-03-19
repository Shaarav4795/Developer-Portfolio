import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps
} from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import "./styles/BlogPosts.css";

type TiltArticleProps = Omit<HTMLMotionProps<"article">, "children"> & {
  children: ReactNode;
  maxTilt?: number;
};

const springConfig = { stiffness: 220, damping: 22, mass: 0.65 };

const TiltArticle = ({ children, maxTilt = 8, style, ...rest }: TiltArticleProps) => {
  const rotateXBase = useMotionValue(0);
  const rotateYBase = useMotionValue(0);
  const rotateX = useSpring(rotateXBase, springConfig);
  const rotateY = useSpring(rotateYBase, springConfig);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const rawX = (event.clientX - rect.left) / rect.width;
    const rawY = (event.clientY - rect.top) / rect.height;
    const x = Math.min(1, Math.max(0, rawX));
    const y = Math.min(1, Math.max(0, rawY));

    rotateYBase.set((x - 0.5) * maxTilt * 2);
    rotateXBase.set((0.5 - y) * maxTilt * 2);
  };

  const resetTilt = () => {
    rotateXBase.set(0);
    rotateYBase.set(0);
  };

  return (
    <motion.article
      {...rest}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onPointerLeave={resetTilt}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformPerspective: 1200
      }}
    >
      {children}
    </motion.article>
  );
};

const BlogPosts = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const reverseParallaxY = useTransform(parallaxY, (value) => -value * 0.6);
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1, 4);
  const spanClasses = ["blog-card-span-5", "blog-card-span-4", "blog-card-span-3"];

  return (
    <section className="blog-section" id="blog" ref={sectionRef} aria-labelledby="blog-heading">
      <motion.div className="blog-orb blog-orb-left" style={{ y: parallaxY }} />
      <motion.div className="blog-orb blog-orb-right" style={{ y: reverseParallaxY }} />

      <div className="blog-container section-container">
        <motion.div
          className="blog-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ amount: 0.35, once: true }}
        >
          <h2 id="blog-heading">From the <span className="blog-journal-accent">Journal</span></h2>
        </motion.div>

        <Link
          className="featured-post-link"
          to={`/blog/${featuredPost.slug}`}
          aria-label={`Read post: ${featuredPost.title}`}
          data-cursor="disable"
        >
          <TiltArticle
            className="featured-post"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.3, once: true }}
            transition={{ duration: 0.85 }}
            whileHover={{ y: -8 }}
            maxTilt={3}
            itemScope
            itemType="https://schema.org/BlogPosting"
          >
            <img src={featuredPost.coverImage} alt={featuredPost.title} loading="lazy" />
            <div className="featured-overlay" />
            <div className="featured-content">
              <div className="post-meta-row">
                <span>{featuredPost.category}</span>
                <span>{featuredPost.date}</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h3 itemProp="headline">{featuredPost.title}</h3>
              <p itemProp="description">{featuredPost.excerpt}</p>
              <span className="read-more">Read full post</span>
            </div>
          </TiltArticle>
        </Link>

        <div className="blog-grid" role="list" aria-label="Blog post list">
          {remainingPosts.map((post, index) => (
            <Link
              key={post.id}
              className={`blog-card-link ${spanClasses[index % spanClasses.length]}`}
              to={`/blog/${post.slug}`}
              aria-label={`Read post: ${post.title}`}
              data-cursor="disable"
              role="listitem"
            >
              <TiltArticle
                className="blog-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.25, once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08
                }}
                whileHover={{ y: -10 }}
                maxTilt={4}
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                <div className="blog-card-cover-wrap">
                  <img src={post.coverImage} alt={post.title} loading="lazy" className="blog-card-cover" />
                </div>
                <div className="blog-card-content">
                  <div className="post-meta-row post-meta-row-small">
                    <span>{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 itemProp="headline">{post.title}</h3>
                  <p itemProp="description">{post.excerpt}</p>
                  <div className="blog-card-footer">
                    <div className="timeline-pill" aria-hidden="true">
                      <span className="timeline-dot" />
                      {post.date}
                    </div>
                    <span className="read-more">Read article</span>
                  </div>
                </div>
              </TiltArticle>
            </Link>
          ))}
        </div>

        <div className="blog-see-all-wrap">
          <Link to="/blog" className="blog-see-all-btn" data-cursor="disable">
            See All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPosts;
