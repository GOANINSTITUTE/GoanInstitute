// src/utils/cloudinary.js

export const CLOUDINARY = {
  cloudName: "dqjcejidw",
  uploadPreset: "goanins",

  getImageUrl(publicId, options = {}) {
    const {
      width,
      height,
      crop = "fill",
      quality = "auto",
      format = "auto",
    } = options;

    let transformations = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    const transformString =
      transformations.length > 0
        ? transformations.join(",") + "/"
        : "";

    return `https://res.cloudinary.com/${CLOUDINARY.cloudName}/image/upload/${transformString}${publicId}`;
  },
};
export const CLOUDINARY_CONFIG = {
  cloudName: "dqjcejidw",
  uploadPreset: "goanins",
};
