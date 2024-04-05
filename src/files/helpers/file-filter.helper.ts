
export const filterImageFiles = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
    
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg','jpeg','png','gif'];

    if(validExtensions.includes(fileExtension)){
        return callback(null, true);
    }

    return callback(null, false);
}

export const filterImageFiles2 = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
        
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
        return callback(null, true);
    
    return callback(null, false);
}