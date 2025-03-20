import tinify from 'tinify';

export const compressImage = async (imagePath: string) => {
  const source = tinify.fromFile(imagePath);
  await source.toFile(imagePath);
};
