import { getCollection, getEntry } from "astro:content";
import defaultThumb from "../assets/default_thumb.jpg";

const DEFAULT_ITEM_DATA = {
	title: "Undefined",
	category: "undefined",
	date: "2100-12-31",
};

export async function getItemsWithThumbnails(collection) {
	const items = await getCollection(collection);
	const images = import.meta.glob(
		"/src/content/**/*.(png|jpg|jpeg|gif|webp|PNG|JPG|JPEG|GIF|WEBP)",
	);
	const placeholderImage = defaultThumb;

	const itemsWithThumbnails = await Promise.all(
		items.map(async (item) => {
			const thumbnailPath = Object.keys(images).find(
				(path) =>
					path
						.toLowerCase()
						.includes(`/src/content/${collection}/${item.slug}/thumb.`) &&
					/(jpe?g|png|webp)$/i.test(path),
			);
			let thumbnail = placeholderImage;
			if (thumbnailPath) {
				thumbnail = (await images[thumbnailPath]()).default;
			}
			return {
				...item,
				data: { ...DEFAULT_ITEM_DATA, ...item.data },
				thumbnail,
			};
		}),
	);

	return itemsWithThumbnails.sort(
		(a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
	);
}

export async function getItemWithThumbnail(collection, slug) {
	const item = await getEntry(collection, slug);
	if (!item) return null;

	const images = import.meta.glob(
		"/src/content/**/*.(png|jpg|jpeg|gif|webp|PNG|JPG|JPEG|GIF|WEBP)",
	);
	const placeholderImage = defaultThumb;

	const thumbnailPath = Object.keys(images).find(
		(path) =>
			path
				.toLowerCase()
				.includes(`/src/content/${collection}/${slug}/thumb.`) &&
			/(jpe?g|png|webp)$/i.test(path),
	);

	let thumbnail = placeholderImage;
	if (thumbnailPath) {
		thumbnail = (await images[thumbnailPath]()).default;
	}

	return {
		...item,
		data: { ...DEFAULT_ITEM_DATA, ...item.data },
		thumbnail,
	};
}
