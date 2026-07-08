import { SolutionsGallery } from "../components/SolutionsGallery";

const SOLUTIONS_GALLERY_URL =
	"https://sa365evergreenwebsite.blob.core.windows.net/microsite/solutions-gallery/index.json";

export default function SolutionGalleryPage() {
	return (
		<div style={{ padding: "40px" }}>
			<h1>Solutions Gallery</h1>
			<SolutionsGallery sourceUrl={SOLUTIONS_GALLERY_URL} />
		</div>
	);
}
