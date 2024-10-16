import { getCollection, getEntry } from "astro:content";
import defaultThumb from "../assets/default_thumb.jpg";
import { DEFAULT_DATA } from "./default_data";

export async function getItemsWithThumbnails(collection) {
	const items = await getCollection(collection);
	const images = import.meta.glob(
		"/src/content/**/*.(png|jpg|jpeg|gif|webp|PNG|JPG|JPEG|GIF|WEBP)",
	);

	const itemsWithThumbnails = await Promise.all(
		items.map(async (item) => ({
			...item,
			data: { ...DEFAULT_DATA, ...item.data },
			thumbnail: await getThumbnail(images, collection, item.slug),
		})),
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

	return {
		...item,
		data: { ...DEFAULT_DATA, ...item.data },
		thumbnail: await getThumbnail(images, collection, slug),
	};
}

async function getThumbnail(images, collection, slug) {
	const thumbnailPath = Object.keys(images).find(
		(path) =>
			path
				.toLowerCase()
				.includes(`/src/content/${collection}/${slug}/thumb.`) &&
			/(jpe?g|png|webp)$/i.test(path),
	);

	return thumbnailPath ? (await images[thumbnailPath]()).default : defaultThumb;
}
