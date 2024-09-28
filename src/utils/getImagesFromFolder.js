export async function getImagesFromFolder(folderPath) {
	const images = import.meta.glob("/src/**/*.(png|jpg|jpeg|gif|webp|PNG|JPG|JPEG|GIF|WEBP)", {
		eager: true,
	});
	const filteredImages = Object.entries(images)
		.filter(([path]) => {
			const isInFolder = path.startsWith(folderPath);
			const isNotThumb = !/thumb\.(jpg|jpeg|png|gif|webp)$/i.test(path);
			return isInFolder && isNotThumb;
		})
		.map(([path, imageModule]) => {
			return imageModule.default;
		});
	return filteredImages;
}
