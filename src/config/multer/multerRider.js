const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    dest: path.resolve(__dirname, '..', '..', '..', 'uploads', 'riders'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,  path.resolve(__dirname, '..', '..', '..', 'uploads', 'riders'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(6, (err, hash) => {
                if(err){
                    cb(err);
                }
                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, fileName);
            })
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname)); 
        if(mimetype && extname){
            return cb(null, true);
        }
        return cb('Formato de arquivo inválido');
    }
}

// fileSize até 5mb