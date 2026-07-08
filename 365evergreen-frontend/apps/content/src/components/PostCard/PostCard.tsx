import styles from "./PostCard.module.css";

type PostCardProps = {
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
};

function truncate(html?: string, max = 200) {
  if (!html) return "";

  // strip HTML tags
  const text = html.replace(/<[^>]*>/g, "");

  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}

export function PostCard({ title, slug, excerpt, image }: PostCardProps) {
  const shortExcerpt = truncate(excerpt, 200);

  return (
    <a href={`/post/${slug}`} className={styles.card}>
      {/* ✅ TITLE FIRST */}
      <h2 className={styles.title}>{title}</h2>

      {/* ✅ IMAGE AFTER TITLE */}
      {image && (
        <img
          src={image}
          alt={title}
          className={styles.image}
        />
      )}

      <div className={styles.body}>
        {shortExcerpt && (
          <p className={styles.excerpt}>{shortExcerpt}</p>
        )}
      </div>
    </a>
  );
}