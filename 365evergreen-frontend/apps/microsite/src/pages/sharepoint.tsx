function PlaceholderPage({
	title,
	description
}: {
	title: string;
	description: string;
}) {
	return (
		<main style={{ padding: "40px" }}>
			<h1>{title}</h1>
			<p>{description}</p>
			<p>This page is a placeholder for the microsite navigation.</p>
		</main>
	);
}

export default function SharePointPage() {
	return (
		<PlaceholderPage
			title="SharePoint"
			description="Placeholder content for the SharePoint section."
		/>
	);
}
