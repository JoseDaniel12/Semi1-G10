 # Manual Tecnico

## Objetivos del manual

### General: 
- Brindar un mayor entendimiento de como se creo la aplicacion de Super Storage utilizando tecnologias inovadoras  de forma rapida segura y fácil.

### Especificos:
- Dar a conocer como implementar una arquitectura utilizando servicios en la nube, y entender el funcionamiento de estos.
- Especificar como integrar sevicios de AWS.
- Demostrar como aplicar tecnologias de la nube en un entorno real.
- Mostrar los usuarios de IAM que se deben utiilizar con sus respectivas politicas asociadas al desarollar distitnos serivicios en la nube.


## Explicación de arquitectura del proyecto
La arquitectura para Super Storage contempla detalles específicos para la implementación y despliegue de cada uno de los componentes del sistema.

### Backend
Para este se contempla una configuración que permita al sistema ser resiliente y redundante. Es por ello que se definen dos máquinas virtuales de EC2, ejecutando en ellas el mismo servicio HTTP.

Las máquinas virtuales y los servicios que contienen se exponen de forma transparente, como un único servicio, a través de un balanceador de carga que además de esto, permite verificar constantemente el estado de los servicios para que la detección de fallas sea lo más inmediata posible.

Los servicios en las máquinas virtuales se comunican de forma directa con los componentes del almacenamiento para tener la capacidad de modificar de alguna forma lo que éstos últimos contienen.

### Almacenamiento

El almacenamiento de datos relevantes para el servicio es definido en dos partes. La base de datos y el almacenamiento de objetos:

- Base de datos: una instancia de RDS que ejecuta MySQL 8.0.28, esta es utilizada para guardar los datos de usuarios y algunos meta-datos necesarios para los archivos que se comparten dentro del servicio.

- Almacenamiento de objetos: un bucket de S3 cuya función es almacenar los archivos que se requieran de los usuarios, así como también los que éstos dispongan subir a Super Storage.

### Frontend

El despliegue del frontend se realiza utilizando un bucket de S3 adicional. Dentro de este se colocan los archivos necesarios para que la interfaz web funcione correctamente.

Este componente tiene comunicación directa con el balanceador de carga, hacia el cuál dirige la totalidad de sus peticiones. El balanceador de carga se encarga solamente de redirigir las solicitudes a una de las máquinas virtuales según corresponda.

## Descripcion de los usuarios de IAM utilizado con sus distintos permisos

### Usuarios:
![tecnico](./imgs/usuarios-jose-iam.jpg)

- jeff: Este usario tiene permisos de administrador para poder crear diferentes serivicos dentro de la cuenta principal de AWS.

- ronald: Este usario tiene permisos de administrador para poder crear diferentes serivicos dentro de la cuenta principal de AWS.

- s3-g10: Este es un usuario el cual manipula Buckets de el servicio de S3 iniciando sesion por medio de programacion.

### Politicas :
![tecnico](./imgs/politica-s3.jpg)

- s3-acces: Este es la politica que aplica permisos de listado, escritura y actualizacion de Buckets dentro de s3


## Capturas de configuracipon de los servicios
* VM de Node: dentro de la imagen se puede observar las propiedades aplicadas a la VM de Node creada dentro del servicio de ec2.
![tecnico](./imgs/vm-node.jpg)

* Grupos de seguridad VM - Node: en esta imagen se puede observar como a la VM de Node se le permitio entradas por el puerto 9000 y salidas por cualquier puerto.
![tecnico](./imgs/seguridad-vm-node.jpg)

* Terminus VM - Node: dentro de esta imagen se puede apreciar como se crear un archivo de docker compose dentro de la VM - Node el cual levanta un contendor que corre la aplicacion utilizando la imagen de node.
![tecnico](./imgs/terminus-vm-node.jpg)

* RDS - MySQL: en esta imagen se pueden ver las configuraciones aplicadas para la base de datos en MySQL con el servicio de RDS.
![tecnico](./imgs/rds.PNG)

* RDS - Modelo entidad relación: en esta imagen se puede ver el modelo entidad relación utilizado para la base de datos.
![tecnico](./imgs/modelo-er.png)

* Balanceador de carga: Se utilizo el grupo de destinos que fue creado donde se apuntaban a las dos instancias de la api. 
![tecnico](./imgs/balanceador.png)

* Pagina web: En S3 se creo un bucket publico, donde se colocaron los archivos resultantes de react build. Se activo el alojamiento de sitio web estatico y se actualizo la politica. 

![tecnico](./imgs/appweb1.png)

![tecnico](./imgs/appweb2.png)

![tecnico](./imgs/appweb3.png)

![tecnico](./imgs/appweb4.png)

## Conclusiones
- Las tecnologías utilizadas para el desarrollo de la aplicación ayudaron a que el proceso fuese más rápido, seguro y fácil.
- La arquitectura presentada muestra el funcionamiento integral de diferentes servicios en la nube.
- La integración de los servicios de AWS fue especificada y realizada de manera correcta.
- Las tecnologías de la nube fueron aplicadas a un entorno real y funcional.
- Los usuarios de IAM fueron asociados a las políticas correspondientes para el desarrollo e implementación de distintos servicios en la nube.

