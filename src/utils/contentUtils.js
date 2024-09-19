import { getCollection } from "astro:content";

export async function getItemsWithThumbnails(base) {
	const items = await getCollection(base);

	const images = import.meta.glob("/src/content/**/*.(png|jpg|jpeg|gif|webp)");

	const placeholderImage = "/default_thumb.jpg";

	const itemsWithThumbnails = await Promise.all(
		items.map(async (item) => {
			const thumbnailPath = Object.keys(images).find(
				(path) =>
					path.includes(`/src/content/${base}/${item.slug}/thumb.`) &&
					(path.endsWith(".jpg") || path.endsWith(".png")),
			);
			let thumbnail = placeholderImage;
			if (thumbnailPath) {
				thumbnail = (await images[thumbnailPath]()).default;
			}
			return { ...item, thumbnail, base };
		}),
	);

	return itemsWithThumbnails.sort(
		(a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
	);
}
