import { Injectable, Logger } from '@nestjs/common';
import toStream = require('buffer-to-stream');
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { ImageType } from 'src/common/types';

@Injectable()
export class CloudinaryService {
	private logger: Logger = new Logger('CloudinaryService');

	/**
	 * Upload new image to cloudinary
	 * @param file
	 * @returns Promise with the response or error
	 */
	async uploadImage(
		file: Express.Multer.File,
	): Promise<UploadApiResponse | UploadApiErrorResponse> {
		//* Try to upload the file and resolve the response if success or reject in case of error
		return new Promise((resolve, reject) => {
			//* Upload the file to cloudinary
			const upload = v2.uploader.upload_stream((error, result) => {
				if (error) {
					this.logger.warn('Image upload failed 😪');
					return reject(error);
				}

				this.logger.log(
					'Image upload success 😃, with public_id: ' + result.public_id,
				);
				resolve(result);
			});

			//? convert the file from buffer to a readable stream
			toStream(file.buffer).pipe(upload);
		});
	}

	/**
	 * Upload array of images to cloudinary
	 * @param uploadedImages
	 * @returns images array of ImageType
	 */
	async uploadArrayOfImages(uploadedImages: any): Promise<ImageType[]> {
		let images: ImageType[] = [];
		try {
			this.logger.debug(
				`Uploading ${uploadedImages.length} images to cloudinary`,
			);

			//* Loop over the uploaded images

			//* Await the uploading operation
			await Promise.all(
				uploadedImages.map(async image => {
					const savedImage = await this.uploadImage(image);

					//? If upload success, save image url and public id to db
					if (savedImage.url) {
						//* Push the image to the list of images
						images.push({
							url: savedImage.url,
							publicId: savedImage.public_id,
						});
					}
				}),
			);
		} catch (error) {
			this.logger.error('Cannot upload images to cloudinary, ', error);
		}

		return images;
	}

	/**
	 * Destroy single image from cloudinary
	 * @param publicId
	 */
	async destroyImage(publicId: string) {
		try {
			await v2.uploader.destroy(publicId);

			this.logger.log('Image removed 👏🏻');
		} catch (error) {
			this.logger.error('Cannot remove image from cloudinary, ', error);
		}
	}

	/**
	 * Destroy array of images from cloudinary
	 * @param images
	 */
	async destroyArrayOfImages(images: ImageType[]) {
		this.logger.debug(`Deleting ${images.length} images from cloudinary`);
		try {
			//* Loop over the images and remove one by one
			await Promise.all(
				images.map(async image => {
					await this.destroyImage(image.publicId);
				}),
			);
		} catch (error) {
			this.logger.error('Cannot remove images from cloudinary, ', error);
		}
	}
}
