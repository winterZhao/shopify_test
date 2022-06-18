import Formidable from 'formidable';
import * as mkdirp from 'mkdirp';
import express from 'express';
import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';

interface FileToolResult {
    fields?: Formidable.Fields,
    filename?: string
}

let form: any = null;

const fileTool = {
  uploadFile(req: express.Request) {
    if (!form) {
      const targetDirName = moment().format('YYYYMM');
      const dirName = path.resolve(__dirname, `../../public/upload_files/${targetDirName}`);
      if (!fs.existsSync(dirName)) {
        mkdirp.sync(dirName);
      }

      form = new Formidable.IncomingForm({
        uploadDir: dirName,
        keepExtensions: true,
        encoding: 'utf-8',
      });
    }

    return new Promise((resolve, reject) => {
      form.parse(req, (err: any, fields: Formidable.Fields, files: Formidable.Files | any) => {
        if (err) {
          reject(err);
          return;
        }
        const filename: string = files.file?.filepath;
        resolve(({
          fields,
          filename,
        } as FileToolResult));
      });
    });
  },
};

export default fileTool;
