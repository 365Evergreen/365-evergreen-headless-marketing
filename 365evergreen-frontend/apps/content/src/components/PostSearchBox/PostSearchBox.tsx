import { useEffect, useState } from "react";
import styles from "./PostSearchBox.module.css";

type Post = {
  id: string;
  title: string;
  slug: string;
};

type PostSearchBoxProps = {
  posts: Post[];
  onResult: (posts: Post[] | null) => void;
};

export function PostSearchBox({ posts, onResult }: PostSearchBoxProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (posts.length > 0) {
      onResult(null);
    }
  }, [posts, onResult]);

  function handleChange(value: string) {
    setQuery(value);
  }

  function handleSearch() {
    const nextQuery = query.trim();

    if (!nextQuery) {
      onResult(null);
      return;
    }

    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(nextQuery.toLowerCase())
    );

    onResult(filtered);
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder="Search posts…"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className={styles.input}
      />

      <button type="button" onClick={handleSearch} className={styles.button}>
        Search
      </button>
    </div>
  );
}