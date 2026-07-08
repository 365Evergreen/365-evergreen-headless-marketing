import { useState } from "react";
import { ContentLayout } from "./layouts/ContentLayout";
import { Section } from "./components/Section";
import { PostList } from "./components/PostList/PostList";
import { PostSearchBox } from "./components/PostSearchBox/PostSearchBox";
import { PostPage } from "./components/PostPage/PostPage";

export default function App() {
  const [filteredPosts, setFilteredPosts] = useState<any[] | null>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const pathname = window.location.pathname;

  if (pathname.startsWith("/post/")) {
    const slug = pathname.replace(/^\/post\//, "").replace(/\/$/, "");

    if (slug) {
      return <PostPage slug={slug} />;
    }
  }

  return (
    <ContentLayout>
      <Section>
        <h1>Latest from 365 Evergreen</h1>

        <PostSearchBox
          posts={allPosts}
          onResult={setFilteredPosts}
        />

        <PostList
          onLoaded={setAllPosts}
          postsOverride={filteredPosts}
        />
      </Section>
    </ContentLayout>
  );
}