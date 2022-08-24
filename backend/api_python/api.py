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

        usuario = request.json['usuario']
        correo = request.json['correo']
        contrasenia = encriptar(request.json['contrasenia'])
        try:
            cur = mysql.connection.cursor()
            cur.callproc('Registrar', (usuario, correo, contrasenia.decode()))
            mensaje = cur.fetchone()

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
                        'contrasenia': usuario[3]
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

    key = "1/" + str("pepe.jpg")

    #s3.Bucket(bucket).put_object(Key=key, Body=file)
    return {'Key': key}, 200


@app.route('/archivos/borrarArchivo', methods=['DELETE'])
def deleteArchivo():
    userId = request.json['userId']
    password = request.json['password']
    fileName = request.json['fileName']
    key = "1/" + str("pepe.jpg")
    #s3_object = s3.Object(bucket, key)
    # s3_object.delete()
    return {'msg': 'File errased.'}, 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=puerto, debug=True)
