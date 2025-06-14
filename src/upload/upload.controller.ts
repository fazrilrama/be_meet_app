import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

@Controller('record')
export class UploadController {
constructor(private readonly uploadService: UploadService) {}

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './recorder',
                filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `video-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith('video/')) {
                    return cb(new Error('Only video files are allowed!'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 100 * 1024 * 1024, // Max 100MB
            },
        }),
    )

    uploadVideo(@UploadedFile() file: Express.Multer.File, @Body('meeting_id') meeting_id) {

        try {
            const metadata = this.uploadService.saveFileMetadata(file, meeting_id);
            return {
                status: true,
                message: 'Upload successful',
                ...metadata,
            };
        } catch(err) {
            return {
                status: false,
                message: err.message
            }
        }
    }
}  