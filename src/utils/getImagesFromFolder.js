const contentImages = import.meta.glob(
	"/src/content/**/*.(png|jpg|jpeg|gif|webp)",
);

const publicImages = import.meta.glob("/public/**/*.(png|jpg|jpeg|gif|webp)", {
	import: "default",
});

const images = { ...contentImages, ...publicImages };

export function getImagesFromFolder(folderPath) {
	return Object.entries(images)
		.filter(([path]) => path.includes(folderPath))
		.filter(([path]) => !path.endsWith("thumb.jpg"))
		.map(([path, importFunc]) => ({ path, importFunc }));
}
