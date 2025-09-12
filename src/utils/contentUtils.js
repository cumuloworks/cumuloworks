import { getCollection, getEntry } from "astro:content";
import defaultThumb from "@/assets/default_thumb.jpg";

// 共通の処理を関数として抽出
async function processItemData(item) {
	const dateObj = item.data.date;
	const dateString = dateObj instanceof Date
		? dateObj.toISOString().split("T")[0]
		: String(dateObj);
	return {
		...item,
		data: {
			...item.data,
			// 表示互換性のため date は文字列を保持
			date: dateString,
			// ソートや計算用に Date オブジェクトも保持
			dateObj,
			dateString,
		},
	};
}

async function getThumbnail(images, collection, slug) {
	const key = `/src/content/${collection}/${slug}/thumb.`;
	const thumbnailPath = Object.keys(images).find((path) => path.includes(key));
	return thumbnailPath ? (await images[thumbnailPath]()).default : defaultThumb;
}

export async function getItemsWithThumbnails(collection) {
	const items = await getCollection(collection);
	const images = import.meta.glob(
		"/src/content/**/thumb.(png|jpg|jpeg|webp|PNG|JPG|JPEG|WEBP)",
	);

	const itemsWithThumbnails = await Promise.all(
		items.map(async (item) => ({
			...(await processItemData(item)),
			thumbnail: await getThumbnail(images, collection, item.slug),
		})),
	);

	return itemsWithThumbnails.sort(
		(a, b) => b.data.dateObj.getTime() - a.data.dateObj.getTime(),
	);
}

export async function getItemWithThumbnail(collection, slug) {
	const item = await getEntry(collection, slug);
	if (!item) return null;

	const images = import.meta.glob(
		"/src/content/**/thumb.(png|jpg|jpeg|webp|PNG|JPG|JPEG|WEBP)",
	);

	return {
		...(await processItemData(item)),
		thumbnail: await getThumbnail(images, collection, slug),
	};
}
