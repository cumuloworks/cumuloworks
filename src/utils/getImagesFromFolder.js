export async function getImagesFromFolder(folderPath) {
	const images = import.meta.glob("/src/**/*.(png|jpg|jpeg|gif|webp)", {
		eager: true,
	});
	const filteredImages = Object.entries(images)
		.filter(([path]) => {
			const isInFolder = path.startsWith(folderPath);
			const isNotThumb = !path.endsWith("thumb.jpg");
			return isInFolder && isNotThumb;
		})
		.map(([path, imageModule]) => {
			return imageModule.default;
		});
	return filteredImages;
}
