import { useEffect, useState } from "react";
import { PostCard } from "../PostCard/PostCard";
import styles from "./PostList.module.css";

type Post = {
  id?: string; // optional because index.json may not include it
  title: string;
  slug: string;
  uri?: string;
  excerpt?: string;
  image?: string;
};

type PostIndexImage = {
  node?: {
    sourceUrl?: string;
  };
};

type PostIndexItem = {
  id?: string;
  title?: string;
  slug?: string;
  uri?: string;
  excerpt?: string;
  image?: string | PostIndexImage | null;
};

type PostListProps = {
  onLoaded: (posts: Post[]) => void;
  postsOverride?: Post[] | null;
};

const POSTS_URL =
  "https://sa365evergreenwebsite.blob.core.windows.net/content/posts/index.json";

export function PostList({ onLoaded, postsOverride }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(POSTS_URL);

        if (!res.ok) {
          throw new Error(`Failed to load posts: ${res.status}`);
        }

        const data = await res.json();
        const rawItems: PostIndexItem[] = Array.isArray(data?.items?.body)
          ? data.items.body
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
              ? data
              : [];

        const loadedPosts: Post[] = rawItems
          .filter((item): item is PostIndexItem & { title: string; slug: string } =>
            Boolean(item?.title && item?.slug)
          )
          .map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            uri: item.uri,
            excerpt: item.excerpt,
            image:
              typeof item.image === "string"
                ? item.image
                : item.image?.node?.sourceUrl,
          }));

        if (active) {
          setPosts(loadedPosts);
          onLoaded(loadedPosts);
          setError(null);
        }
      } catch {
        if (active) {
          setError("Unable to load posts");
          setPosts([]);
          onLoaded([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [onLoaded]);

  // ✅ CRITICAL FIX — handle search override correctly
  const visiblePosts =
    Array.isArray(postsOverride) ? postsOverride : posts;

  // ✅ Loading state (only when no override yet)
  if (isLoading && posts.length === 0) {
    return <div className={styles.state}>Loading posts…</div>;
  }

  // ✅ Error state
  if (error && visiblePosts.length === 0) {
    return <div className={styles.stateError}>{error}</div>;
  }

  // ✅ No results state (valid for search)
  if (visiblePosts.length === 0) {
    return <div className={styles.state}>No posts found.</div>;
  }

  return (
    <div className={styles.grid}>
      {visiblePosts.map((post) => (
        <PostCard
          key={post.id ?? post.slug}
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          image={post.image}
        />
      ))}
    </div>
  );
}
