import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type SolutionContent = {
  title?: string;
  slug?: string;
  content?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  e365solution?: {
    tags?: string[];
  };
};

type SolutionResponse =
  | SolutionContent
  | {
      data?: {
        solution?: SolutionContent;
      };
    };

type SolutionViewModel = {
  title: string;
  slug: string;
  content: string;
  image?: string;
  tags: string[];
};

const SOLUTIONS_CONTENT_BASE_URL =
  "https://sa365evergreenwebsite.blob.core.windows.net/microsite/solutions-gallery";

function getSolutionContent(response: unknown): SolutionContent | undefined {
  if (typeof response === "object" && response !== null && "data" in response) {
    const wrappedResponse = response as {
      data?: {
        solution?: SolutionContent;
      };
    };

    return wrappedResponse.data?.solution;
  }

  if (typeof response === "object" && response !== null) {
    return response as SolutionContent;
  }

  return undefined;
}

export default function SolutionPage() {
  const { slug } = useParams();
  const [solution, setSolution] = useState<SolutionViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSolution() {
      try {
        setIsLoading(true);
        setError(null);

        if (!slug) {
          throw new Error("Missing solution slug.");
        }

        const response = await fetch(`${SOLUTIONS_CONTENT_BASE_URL}/${slug}.json`);

        if (!response.ok) {
          throw new Error(`Failed to load solution data (${response.status})`);
        }

        const data: unknown = await response.json();
        const solutionData = getSolutionContent(data as SolutionResponse);

        const title = solutionData?.title?.trim() ?? "";
        const content = solutionData?.content?.trim() ?? "";
        const image = solutionData?.featuredImage?.node?.sourceUrl;
        const tags = Array.isArray(solutionData?.e365solution?.tags)
          ? solutionData.e365solution.tags.filter(Boolean).map(String)
          : [];

        if (!title || !content) {
          throw new Error("Solution content is incomplete.");
        }

        if (isMounted) {
          setSolution({
            title,
            slug: solutionData?.slug?.trim() || slug,
            content,
            image,
            tags
          });
        }
      } catch (loadError) {
        console.error("Failed to load solution page", loadError);

        if (isMounted) {
          setError("Unable to load this solution right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSolution();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return <main style={{ padding: "40px" }}>Loading solution...</main>;
  }

  if (error) {
    return <main style={{ padding: "40px" }}>{error}</main>;
  }

  if (!solution) {
    return (
      <main style={{ padding: "40px" }}>
        <p>We could not find that solution.</p>
        <p>
          <Link to="/solution-gallery">Back to solutions gallery</Link>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px" }}>
      <p>
        <Link to="/solution-gallery">Back to solutions gallery</Link>
      </p>
      <article>
        {solution.image && (
          <img
            src={solution.image}
            alt={solution.title}
            style={{ width: "100%", maxWidth: 720, borderRadius: 16 }}
          />
        )}
        <h1>{solution.title}</h1>
        {solution.tags.length > 0 && (
          <ul>
            {solution.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <div dangerouslySetInnerHTML={{ __html: solution.content }} />
      </article>
    </main>
  );
}