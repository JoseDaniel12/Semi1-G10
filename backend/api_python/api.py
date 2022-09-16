from flask import Flask, request
from flask_mysqldb import MySQL
from flask_cors import CORS
from datetime import datetime
from encriptacion import *
import os
import boto3


app = Flask(__name__)
print(os.environ.get('BASE_HOST'))
print(os.environ.get('BASE_USER'))
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


def get_current_date():
    now = datetime.now()
    curr_date = now.strftime("%Y/%m/%d %H:%M:%S")
    return curr_date


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
            cur.callproc('Registrar', (usuario, correo,
                         contrasenia.decode(), extension))
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

                key = "fotos/" + str(mensaje[2]) + "." + extension
                s3.Bucket(bucket).put_object(Key=key, Body=file, ContentType='image')

                return usuario, mensaje[0]
            else:
                return {'mensaje': mensaje[1]}, mensaje[0]
        except:
            return {'mensaje': 'Error en la base de datos'}, 400


@app.route('/login', methods=['POST'])
def Login():
    if request.method == 'POST':

        usuario_correo = request.json['usuario_correo']
        contrasenia = request.json['contrasenia']

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

@app.route('/allFiles', methods=['POST'])
def AllFiles():
    if request.method == 'POST':

        userId = str(request.json['userId'])

        try:
            cur = mysql.connection.cursor()
            cur.execute("CALL AllFiles(" + userId + ");")
            archivos = cur.fetchall()

            files = []

            if archivos:
                for archivo in archivos:
                    print("archivo: ", archivo)
                    file = {
                        'usuario': archivo[0],
                        's3_key': archivo[1],
                        'visibilidad': archivo[2],
                        'fecha': archivo[3]
                    }
                    files.append(file)
                return {"archivos": files}, 200
            else:
                return {'caso': 1, 'mensaje': 'correo o usuario no existe'}, 400
        except:
            return {'caso': 3, 'mensaje': 'error con base de datos'}, 400

@app.route('/archivosAmigos', methods=['POST'])
def ArchivosAmigos():
    if request.method == 'POST':

        userId = str(request.json['userId'])

        try:
            cur = mysql.connection.cursor()
            cur.execute("CALL ArchivosAmigos(" + userId + ");")
            archivos = cur.fetchall()

            files = []

            if archivos:
                for archivo in archivos:
                    print("archivo: ", archivo)
                    file = {
                        'nombre_usuario': archivo[0],
                        'usuario': archivo[1],
                        's3_key': archivo[2],
                        'visibilidad': archivo[3],
                        'fecha': archivo[4]
                    }
                    files.append(file)
                return {"archivos": files}, 200
            else:
                print("NO EXISTE")
                return {"archivos": []}, 200
        except Exception as err:
            print(str(err))
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
            (s3_key, visibilidad, usuario, fecha) 
            VALUES ('{key}', {visibility}, {userId}, '{get_current_date()}');
            COMMIT;
        '''
        cur.execute(query)
        cur.fetchone()

    s3.Bucket(bucket).put_object(Key=key, Body=file, ContentType=deducirContentType(extension))
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

@app.route('/archivos/editarArchivo', methods=['PUT'])
def editarArchivo():
    userId = str(request.json['userId'])
    password = request.json['password']
    fileNameOriginal = request.json['fileNameOriginal']
    fileNameDestino = request.json.get('fileNameDestino')
    visibilidad = request.json['visibilidad']

    if visibilidad != 1 and visibilidad != 0:
        return { err : "El valor de visibilidad debe ser solamente los números 0 o 1." }, 400


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

    # Si fileNameDestino es vacío o nulo solo modificar la visibilidad en la base de datos
    if fileNameDestino == None or fileNameDestino == "":
        query = f'''UPDATE archivo SET visibilidad = b'{visibilidad}' WHERE usuario = {userId} AND
                                                                            s3_key = '{userId}/{fileNameOriginal}'; COMMIT;'''
        try:
            cur.execute(query)
        except Exception as err:
            return {"err": str(err)}, 400
        print(query)
        return {"mensaje": "Archivo actualizado."}, 200

    existe_archivo_en_db = False
    existía_antes = True
    # Se verifica si el usuario ya tenia un archivo con ese nombre
    key_anterior = str(userId) + "/" + fileNameOriginal
    query = f'''
        SELECT * FROM archivo
        WHERE (
            s3_key = '{key_anterior}' AND
            usuario = {userId}
        );
        COMMIT;
    '''
    cur.execute(query)
    outcome = cur.fetchone()
    if (outcome is not None):
        existe_archivo_en_db = True
    # Se verifica que no haya un archivo del usuario de nombre fileNameDestino
    key_nueva = userId + "/" + fileNameDestino;
    query = f'''
        SELECT * FROM archivo
        WHERE
            s3_key = '{key_nueva}' AND
            usuario = {userId};'''
    cur.execute(query)
    outcome = cur.fetchone()
    if outcome is None:
        existía_antes = False

    if existe_archivo_en_db and not existía_antes:
        query = f'''
            UPDATE archivo
            SET
                s3_key = '{key_nueva}',
                visibilidad = b'{visibilidad}'
            WHERE
                usuario = {userId} AND s3_key = '{key_anterior}'; COMMIT;'''
        try:
            cur.execute(query)
        except Exception as err:
            return {"err": str(err)}, 400
    else:
        return {"err": "Error al actualizar el archivo, revisar los parámetros."}, 400

    key_origen_completa = bucket + "/" + key_anterior
    s3.meta.client.copy_object(Bucket=bucket, CopySource=key_origen_completa, Key=key_nueva)
    s3_object = s3.Object(bucket, key_anterior)
    s3_object.delete()
    return {"msg": "Archivo actualizado."}, 200

@app.route('/amigos/personas-disponibles', methods=['POST'])
def PersonasDisponibles():
    if request.method == 'POST':

        userId = request.json['userId']

        try:
            cur = mysql.connection.cursor()
            cur.execute(f'''
                SELECT noamigos.id, noamigos.nombre_usuario, noamigos.formatofoto, noamigos.archivos_publicos
                    FROM (SELECT *
                             FROM (SELECT u.id, u.nombre_usuario, u.formatofoto, a.archivos_publicos
                                      FROM usuario u
                                      LEFT JOIN
                                      (SELECT usuario id, count(*) archivos_publicos
                                          FROM archivo WHERE visibilidad = B'1'
                                          GROUP BY usuario) a
                                      ON u.id = a.id) publicos
                             LEFT JOIN
                             (SELECT usuario2
                                 FROM amistad
                                 WHERE usuario1 = {userId}) ami
                             ON publicos.id = ami.usuario2) noamigos
                    WHERE noamigos.usuario2 IS NULL AND noamigos.id != {userId};''')
            personasd = cur.fetchall()

            personas_disponibles = []

            for persona in personasd:
                pers = {
                    'id': persona[0],
                    'nombre_usuario': persona[1],
                    'formatofoto': persona[2],
                    'archivos_publicos': persona[3]
                }
                personas_disponibles.append(pers)
            return personas_disponibles, 200
        except BaseException as err:
            return {'caso': 3, 'mensaje': str(err)}, 400

@app.route('/amigos/agregar-amistad', methods=['POST'])
def AgregarAmistad():
    if request.method == 'POST':

        userIdA = request.json['userIdA']
        userIdB = request.json['userIdB']

        try:
            cur = mysql.connection.cursor()
            cur.execute(f"INSERT INTO amistad (usuario1, usuario2) VALUES ({userIdA}, {userIdB}); COMMIT;")
            cur.execute(f"INSERT INTO amistad (usuario2, usuario1) VALUES ({userIdA}, {userIdB}); COMMIT;")
            return { 'mensaje' : '¡Somos amigos! :D' }, 200
        except BaseException as err:
            return {'caso': 3, 'mensaje': str(err)}, 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=puerto, debug=True)
