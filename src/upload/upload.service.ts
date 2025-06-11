import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  saveFileMetadata(file: Express.Multer.File) {
    const metadata = {
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      uploadTime: new Date(),
      path: `/recorder/${file.filename}`,
    };

    const recorderPath = join(__dirname, '../../recorder');
    console.log(recorderPath);
    const metadataPath = join(recorderPath, 'metadata.json');

    // Pastikan folder recorder ada
    if (!fs.existsSync(recorderPath)) {
      fs.mkdirSync(recorderPath, { recursive: true });
    }

    // Simpan metadata ke metadata.json
    let existing: any[] = [];
    if (fs.existsSync(metadataPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      } catch {
        existing = [];
      }
    }

    existing.push(metadata);
    fs.writeFileSync(metadataPath, JSON.stringify(existing, null, 2));

    return metadata;
  }
}
