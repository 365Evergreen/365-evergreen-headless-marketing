import { useEffect, useMemo, useState } from "react";
import styles from "./SolutionsGallery.module.scss";

type GalleryItem = {
  id?: string | number;
  title?: string;
  slug?: string;
  uri?: string;
  image?: string;
  imageUrl?: string;
  imageSrc?: string;
  thumbnail?: {
    node?: {
      sourceUrl?: string;
    };
  };
  tags?: string[];
  href?: string;
  alt?: string;
};

type GalleryResponse =
  | GalleryItem[]
  | {
      items?: GalleryItem[];
      solutions?: GalleryItem[];
      cards?: GalleryItem[];
      gallery?: GalleryItem[];
      data?: GalleryItem[];
    };

type NormalizedGalleryItem = {
  id: string;
  title: string;
  image: string;
  tags: string[];
  href?: string;
  alt: string;
};

export type SolutionsGalleryProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  sourceUrl?: string;
};

const DEFAULT_SOURCE_URL =
  "https://sa365evergreenwebsite.blob.core.windows.net/microsite/solutions-gallery/index.json";

function isGalleryResponse(value: unknown): value is GalleryResponse {
  return Array.isArray(value) || (typeof value === "object" && value !== null);
}

function extractItems(response: GalleryResponse): GalleryItem[] {
  if (Array.isArray(response)) {
    return response;
  }

  const candidateCollections = [
    response.items,
    response.solutions,
    response.cards,
    response.gallery,
    response.data
  ];

  for (const collection of candidateCollections) {
    if (Array.isArray(collection)) {
      return collection;
    }
  }

  return [];
}

function normalizeItem(item: GalleryItem, index: number): NormalizedGalleryItem | null {
  const title = item.title?.trim();
  const image =
    item.image ??
    item.imageUrl ??
    item.imageSrc ??
    item.thumbnail?.node?.sourceUrl ??
    "";
  const href = item.href ?? item.uri ?? (item.slug ? `/solution/${item.slug}/` : undefined);

  if (!title || !image) {
    return null;
  }

  return {
    id: String(item.id ?? title ?? index),
    title,
    image,
    tags: Array.isArray(item.tags) ? item.tags.filter(Boolean).map(String) : [],
    href,
    alt: item.alt?.trim() || title
  };
}

export function SolutionsGallery({
  eyebrow = "Solutions",
  title = "Solutions Gallery",
  description = "A three-column showcase of related solutions pulled from the shared microsite feed.",
  sourceUrl = DEFAULT_SOURCE_URL
}: SolutionsGalleryProps) {
  const [items, setItems] = useState<NormalizedGalleryItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadGallery() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(sourceUrl);

        if (!response.ok) {
          throw new Error(`Failed to load gallery data (${response.status})`);
        }

        const data: unknown = await response.json();

        if (!isGalleryResponse(data)) {
          throw new Error("Gallery feed format is not supported.");
        }

        const normalized = extractItems(data)
          .map(normalizeItem)
          .filter((item): item is NormalizedGalleryItem => item !== null);

        if (isMounted) {
          setItems(normalized);
        }
      } catch (loadError) {
        console.error("Failed to load solutions gallery", loadError);

        if (isMounted) {
          setError("Unable to load solutions gallery right now.");
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      isMounted = false;
    };
  }, [sourceUrl]);

  const availableTags = useMemo(() => {
    return Array.from(new Set(items.flatMap((item) => item.tags))).sort((left, right) =>
      left.localeCompare(right)
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedTags.length === 0) {
      return items;
    }

    return items.filter((item) =>
      selectedTags.every((selectedTag) => item.tags.includes(selectedTag))
    );
  }, [items, selectedTags]);

  const filteredContent = useMemo(() => {
    if (isLoading) {
      return <p className={styles.status}>Loading solutions...</p>;
    }

    if (error) {
      return <p className={styles.status}>{error}</p>;
    }

    if (filteredItems.length === 0) {
      return <p className={styles.status}>No solutions match the selected filters.</p>;
    }

    return (
      <div className={styles.grid}>
        {filteredItems.map((item) => {
          const card = (
            <>
              <div className={styles.imageWrap}>
                <img className={styles.image} src={item.image} alt={item.alt} loading="lazy" />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                {item.tags.length > 0 && (
                  <ul className={styles.tags} aria-label={`${item.title} tags`}>
                    {item.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          );

          return item.href ? (
            <a key={item.id} className={styles.card} href={item.href}>
              {card}
            </a>
          ) : (
            <article key={item.id} className={styles.card}>
              {card}
            </article>
          );
        })}
      </div>
    );
  }, [error, filteredItems, isLoading]);

  const selectedTagCount = selectedTags.length;

  return (
    <section className={styles.section} aria-labelledby="solutions-gallery-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id="solutions-gallery-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Solution filters">
          <div className={styles.sidebarHeader}>
            <div>
              <p className={styles.sidebarKicker}>Filter by tag</p>
              <p className={styles.sidebarTitle}>Solution tags</p>
            </div>
            {selectedTagCount > 0 && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setSelectedTags([])}
              >
                Clear
              </button>
            )}
          </div>

          <p className={styles.sidebarSummary}>
            {selectedTagCount === 0
              ? `Showing all ${items.length} solutions`
              : `Showing ${filteredItems.length} of ${items.length} solutions`}
          </p>

          {availableTags.length === 0 ? (
            <p className={styles.sidebarEmpty}>No solution tags were returned from the feed.</p>
          ) : (
            <div className={styles.filterList}>
              {availableTags.map((tag) => {
                const isChecked = selectedTags.includes(tag);

                return (
                  <label key={tag} className={styles.filterItem}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(event) => {
                        setSelectedTags((current) =>
                          event.target.checked
                            ? [...current, tag]
                            : current.filter((currentTag) => currentTag !== tag)
                        );
                      }}
                    />
                    <span>{tag}</span>
                  </label>
                );
              })}
            </div>
          )}
        </aside>

        <div className={styles.content}>{filteredContent}</div>
      </div>
    </section>
  );
}