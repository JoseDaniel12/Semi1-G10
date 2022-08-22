import bcrypt

def displayText():
    print( "Geeks 4 Geeks !")

def encriptar(contrasenia):
    bytePwd = contrasenia.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(bytePwd, salt); 

def comparar(enviada, guardada):
    bytePwd = enviada.encode('utf-8')
    byteSv = guardada.encode('utf-8')
    return bcrypt.checkpw(bytePwd, byteSv); 