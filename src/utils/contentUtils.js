import { getCollection } from "astro:content";
import defaultThumb from "../assets/default_thumb.jpg";

export async function getItemsWithThumbnails(base) {
	const items = await getCollection(base);

	const images = import.meta.glob("/src/content/**/*.(png|jpg|jpeg|gif|webp)");

	const placeholderImage = defaultThumb;

	const itemsWithThumbnails = await Promise.all(
		items.map(async (item) => {
			const thumbnailPath = Object.keys(images).find(
				(path) =>
					path.includes(`/src/content/${base}/${item.slug}/thumb.`) &&
					(path.endsWith(".jpg") ||
						path.endsWith(".png") ||
						path.endsWith(".webp")),
			);
			let thumbnail = placeholderImage;
			if (thumbnailPath) {
				thumbnail = (await images[thumbnailPath]()).default;
			}
			const title = item.data.title || "Untitled";
			const category = item.data.category || "Uncategorized";
			const date = item.data.date || "2100-12-31";
			return {
				...item,
				data: { ...item.data, title, category, date },
				thumbnail,
				base,
			};
		}),
	);

	return itemsWithThumbnails.sort(
		(a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
	);
}
