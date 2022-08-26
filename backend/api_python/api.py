from flask import Flask, request
from flask_mysqldb import MySQL
from flask_cors import CORS
from encriptacion import *
import os
import boto3


app = Flask(__name__)
app.config['MYSQL_HOST'] = os.environ.get('BASE_HOST')
app.config['MYSQL_USER'] = os.environ.get('BASE_USER')
app.config['MYSQL_PASSWORD'] = os.environ.get('BASE_PASSWORD')
app.config['MYSQL_DB'] = os.environ.get('BASE_NOMBRE')
mysql = MySQL(app)
CORS(app)

puerto = os.environ.get('PYTHON_PUERTO')


s3 = boto3.resource(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCES_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_KEY')
)


bucket = "archivos-g10-p1"
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg'}


@app.route('/')
def home():
    return 'Semi1_Grupo10'


@app.route('/registrar', methods=['POST'])
def Registrar():
    if request.method == 'POST':

        usuario = request.form['usuario']
        correo = request.form['correo']
        contrasenia = encriptar(request.form['contrasenia'])

        file = request.files['foto']
        if file.filename == '':
            return {'err': 'File not selected.'}, 400
        if file and not allowed_file(file.filename):
            return {'err': 'File type not allowed.'}, 400

        extension = file.filename.split(".")[1]
       
        try:
            cur = mysql.connection.cursor()
            cur.callproc('Registrar', (usuario, correo, contrasenia.decode(), extension))
            mensaje = cur.fetchone()

            print(mensaje)

            if mensaje[0] == 200:
                usuario = {
                    "codigo": 200,
                    "mensaje": mensaje[1],
                    "id": mensaje[2],
                    "nombre_usuario": mensaje[3],
                    "correo": mensaje[4],
                    "contrasenia": mensaje[5],
                    "formatoFoto": mensaje[6]
                }
                
                key =   "fotos/" + mensaje[2] + "." + extension
                s3.Bucket(bucket).put_object(Key=key, Body=file)

                return usuario, mensaje[0]
            else:
                return {'mensaje': mensaje[1]}, mensaje[0]
        except:
            return {'mensaje': 'Error en la base de datos'}, 400


@app.route('/login', methods=['POST'])
def Login():
    if request.method == 'POST':

        usuario_correo = request.form['usuario_correo']
        contrasenia = request.form['contrasenia']

        try:
            cur = mysql.connection.cursor()
            cur.execute("CALL Login('" + usuario_correo + "');")
            usuario = cur.fetchone()

            if usuario:
                if comparar(contrasenia, usuario[3]):
                    user = {
                        'id': usuario[0],
                        'nombre_usuario': usuario[1],
                        'correo': usuario[2],
                        'contrasenia': usuario[3],
                        'formatoFoto': usuario[4]
                    }
                    return user, 200
                else:
                    return {'caso': 2, 'mensaje': 'contrasenia incorrecta'}, 400
            else:
                return {'caso': 1, 'mensaje': 'correo o usuario no existe'}, 400
        except:
            return {'caso': 3, 'mensaje': 'error con base de datos'}, 400


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/archivos/subirArchivo', methods=['POST'])
def subirArchivo():
    userId = request.form['userId']
    password = request.form['password']
    fileName = request.form['fileName']
    visibility = request.form['visibility']

    if 'file' not in request.files:
        return {'err': 'File not uploaded.'}, 400

    file = request.files['file']
    if file.filename == '':
        return {'err': 'File not selected.'}, 400
    if file and not allowed_file(file.filename):
        return {'err': 'File type not allowed.'}, 400

    # get paswword from de db
    query = f"SELECT contrasenia AS encrypt_password FROM usuario WHERE id = {userId};  COMMIT;"
    cur = mysql.connection.cursor()
    cur.execute(query)
    outcome = cur.fetchone()
    if outcome is None:
        return {"err": f"No existe algun usuario con el id = {userId}."}, 400

    # Si la contrasñea ingresada no es igual a la encriptada de la db
    dbEncryptedPassword = outcome[0]
    if (not comparar(password, dbEncryptedPassword)):
        return {"err": "La contrseña ingresada es incorrecta."}, 400

    # Se verifica si el usuario ya tenia un archivo con ese nombre
    extension = file.filename.split(".")[1]
    key = userId + "/" + fileName + "." + extension
    query = f'''
        SELECT * FROM archivo
        WHERE (
            s3_key = '{key}' AND
            visibilidad = {visibility} AND 
            usuario = {userId}
        );
        COMMIT;
    '''
    cur.execute(query)
    outcome = cur.fetchone()
    if (outcome is None):
        print("si entro")
        # De no existir guarada su registro en la db
        query = f'''
            INSERT INTO archivo 
            (s3_key, visibilidad, usuario) 
            VALUES ('{key}', {visibility}, {userId});
            COMMIT;
        '''
        cur.execute(query)
        cur.fetchone()

    s3.Bucket(bucket).put_object(Key=key, Body=file)
    return {"msg": "Archivo subido exitosamente."}, 200


@app.route('/archivos/borrarArchivo', methods=['DELETE'])
def deleteArchivo():
    userId = request.json['userId']
    password = request.json['password']
    fileName = request.json['fileName']
    key = "1/" + str("pepe.jpg")

    # get paswword from de db
    query = f"SELECT contrasenia AS encrypt_password FROM usuario WHERE id = {userId};"
    cur = mysql.connection.cursor()
    cur.execute(query)
    outcome = cur.fetchone()
    if outcome is None:
        return {"msg": f"No existe algun usuario con el id  = {userId}."}, 400

    # Si la contrasñea ingresada no es igual a la encriptada de la db
    dbEncryptedPassword = outcome[0]
    print(dbEncryptedPassword)
    if (not comparar(password, dbEncryptedPassword)):
        return {"err": "La contrseña ingresada es incorrecta."}, 400

    # Borra el registor del archivo en la base de datos
    key = f"{userId}/{fileName}"
    query = f'''
        DELETE FROM archivo 
        WHERE (
            s3_key = '{key}' AND
            usuario = {userId}
        );
        COMMIT;
    '''
    cur.execute(query)

    s3_object = s3.Object(bucket, key)
    s3_object.delete()
    return {'msg': 'File errased.'}, 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=puerto, debug=True)
