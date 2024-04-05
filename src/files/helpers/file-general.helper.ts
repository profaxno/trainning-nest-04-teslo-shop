
export const renameFile = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
    
    if(!file) return callback(new Error('File is empty'), false);

    
    
    const fileSize = file.size;
    const fileSizeLimit = 1000000; // 1 MB
    if(fileSize > fileSizeLimit){
        return callback(new Error(`File size exceeds the limit ${fileSizeLimit/1000000} MB`), false);
    }

    const fileName = file.originalname.split('.')[0];
    const fileNameSizeLimit = 20; 
    if(fileName.length > fileNameSizeLimit){
        return callback(new Error(`File name exceeds the ${fileNameSizeLimit} character limit`), false);
    }

    const fileExtension = file.mimetype.split('/')[1];
    const newFileName = `${fileName}-${Date.now()}.${fileExtension}`;
    callback(null, newFileName)
}
