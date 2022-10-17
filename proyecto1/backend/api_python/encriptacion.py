import bcrypt

def encriptar(contrasenia):
    bytePwd = contrasenia.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(bytePwd, salt); 

def comparar(enviada, guardada):
    bytePwd = enviada.encode('utf-8')
    byteSv = guardada.encode('utf-8')
    return bcrypt.checkpw(bytePwd, byteSv); 

def deducirContentType(extension):
    content_type = 'image'
    if (extension == 'txt') :
        content_type = extension
    elif (extension == 'pdf'):
        content_type = 'application/pdf'
    return content_type; 