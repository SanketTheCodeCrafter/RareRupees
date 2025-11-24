/**
 * Compresses an image file using HTML5 Canvas.
 * @param {File} file - The image file to compress.
 * @param {Object} options - Compression options.
 * @param {number} [options.maxWidth=1920] - Max width of the output image.
 * @param {number} [options.maxHeight=1920] - Max height of the output image.
 * @param {number} [options.quality=0.7] - JPEG quality (0 to 1).
 * @param {number} [options.maxSizeMB=1] - Target file size in MB.
 * @returns {Promise<File>} - The compressed file.
 */
export const compressImage = async (file, options = {}) => {
    const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 0.7,
        maxSizeMB = 1,
    } = options;

    if (!file || !(file instanceof File)) {
        return file;
    }

    // If file is already smaller than target, return it
    if (file.size / 1024 / 1024 <= maxSizeMB) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Maintain aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Recursive compression to hit target size
                let currentQuality = quality;

                const attemptCompression = (q) => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error("Canvas to Blob conversion failed"));
                                return;
                            }

                            // If we are under the limit or quality is too low, return
                            if (blob.size / 1024 / 1024 <= maxSizeMB || q <= 0.1) {
                                const compressedFile = new File([blob], file.name, {
                                    type: "image/jpeg",
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                // Try again with lower quality
                                attemptCompression(q - 0.1);
                            }
                        },
                        "image/jpeg",
                        q
                    );
                };

                attemptCompression(currentQuality);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
