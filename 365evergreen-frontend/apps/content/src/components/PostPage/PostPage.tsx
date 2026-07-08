import { useEffect, useState } from "react";
import { ContentLayout } from "../../layouts/ContentLayout";
import { Section } from "../Section";
import { PostMeta } from "../PostMeta";
import styles from "./PostPage.module.css";

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  uri?: string;
  image?: string;
};

type PostPageProps = {
  slug: string;
};

const BASE_URL =
  "https://sa365evergreenwebsite.blob.core.windows.net/content/posts";

export function PostPage({ slug }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`${BASE_URL}/${slug}.json`);

        if (!res.ok) {
          throw new Error(`Post not found: ${res.status}`);
        }

        const data = await res.json();

        if (active) {
          setPost(data);
          setError(null);
        }
      } catch {
        if (active) {
          setError("Unable to load post");
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
  }, [slug]);

  // ✅ Loading state
  if (isLoading) {
    return (
      <ContentLayout>
        <Section>
          <div className={styles.state}>Loading post…</div>
        </Section>
      </ContentLayout>
    );
  }

  // ✅ Error state
  if (error || !post) {
    return (
      <ContentLayout>
        <Section>
          <div className={styles.error}>Post not found</div>
        </Section>
      </ContentLayout>
    );
  }

  // ✅ Success state
  return (
    <ContentLayout>
      <Section>
        <article className={styles.article}>
          {/* Breadcrumbs / meta */}
          <PostMeta uri={post.uri} />

          {/* Title */}
          <h1 className={styles.title}>{post.title}</h1>

          {/* Featured image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className={styles.image}
            />
          )}

          {/* Content */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </Section>
    </ContentLayout>
  );
}