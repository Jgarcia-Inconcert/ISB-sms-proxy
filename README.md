# SMS PROXY - AWS SERVERLESS

## DESCRIPCIÓN

### Propósito

API REST desarrollada para integración SMS externa con OCC. Solo contempla SMS saliente desde OCC, sin notificación de estado de SMS asincrono (se retorna el estado en el response de forma sincrona, no usa el webhook de OCC).

Estructura SMS saliente OCC (request, response):

[Ver documentación](https://inconcert.atlassian.net/wiki/spaces/i6Docs/pages/159842336/Agregar+canal+SMS+al+sistema+omniChannel)

### Tecnologías clave

- Nodejs versión 22.
- AWS serverless.

## CARACTERÍSTICAS

- El desarrollo se puede ejecutar de forma local, corriendo el server.js, este publicara el servicio en el puerto que se especifique en PORT el archivo .env.
- La integración se hace con Infobip mediente el método GET para enviar el SMS a un número en particular.
- Escalable a agregar distintos metodos siguiendo la estructura de servicios y rutas.

### Arquitectura

- API Gateway: Expone el servicio REST.
- Lambda Functions: Ejecuta el servicio REST.
- CloudWatch*: Opcional, lo podrias habilitar a la hora de configurar tu perfil para lambda.

### Requisitos previos

- Node.js version 22.
- AWS CLI configurado en tu local con credenciales.

## CONFIGURACIÓN

Role AWS Isb: arn:aws:iam::699217828267:role/lambda-apigateway-role //pendiente

ID de cuenta:
  sms-isb //pendiente
  879072738023 //pendiente

### CONFIGURAR LAMBDA

La configuración del rol se puede realizar en la interfaz de AWS

1. Primero debemos crear una política de permisos que permita a la función acceder a los recursos de AWS necesarios, en este caso se configura para que escriba registros en Amazon CloudWatch.

2. Abrir la página de politicas IAM: [https://console.aws.amazon.com/iam/home#/policies](https://console.aws.amazon.com/iam/home#/policies)

3. Seleccionar Crear política.

4. Elegir JSON y colocar la siguiente política personalizada.

    ```json
    {
    "Version": "2012-10-17",
    "Statement": [
        {
        "Sid": "",
        "Resource": "*",
        "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        "Effect": "Allow"
        }
    ]
    }
    ```

5. Dar siguiente y en el nombre de la política colocar "lambda-apigateway-policy" (esto lo puedes hacer como definas).

6. Crear la política.

7. Con el rol, el API Key el API Secret de la cuenta se podrá subir la función usando el paquete de este repositorio.

#### NOTA

Es necesario tener aws-cli correctamente configurado, para ello puedes realizar:

> aws configure

Luego colocas los datos de Key y Secret. En caso se use token se puede añadir esto directamente en el archivo de configuracion generado

> vim /home/user/.aws/credentials

```text
[default]
aws_access_key_id = <key_id>
aws_secret_access_key = <access_key>
aws_session_token = <session_token>
```

### CODIGO SERVICIO

1. Clonar el repositorio

    ```bash
    git clone X
    cd X
    ```

2. Instalar dependencias

    > npm install

3. Crear las variables de entorno .env en el directorio raiz con las siguientes variables (reemplazar segun sea el caso).

    ```text
    # PARAMETROS OCC
    SMS_QUEUE_STATUS="SEND"
    SMS_FAILED_STATUS="FAIL"

    # PARAMETROS TEST LOCAL
    PORT=3001

    # PARAMETROS INFOBIP - METODO GET USADO POR UTEL
    SMS_INFOBIP_URL="https://gy2dm6.api.infobip.com/sms/1/text/query?"
    SMS_USERNAME="Utel3_IC"
    SMS_PASSWORD="Utelgy2dm6*!"
    ```

4. Comandos disponibles en package.json

    ```text
        "test": "node server.js"
        "clean": "rm utel-sms-proxy.zip",
        "zip": "zip -r utel-sms-proxy.zip index.js node_modules package.json api config .env",
        "deploy": "aws lambda create-function --function-name utel-sms-proxy-function --zip-file fileb://utel-sms-proxy.zip --handler index.handler --runtime nodejs22.x --role arn:aws:iam::481665103601:role/lambda-apigateway-role",
        "upload": "aws lambda update-function-code --function-name utel-sms-proxy-function --zip-file fileb://utel-sms-proxy.zip"
    ```

    Detalle

    - test: Ejecuta el servicio localmente para probar los metodos.

    - zip: Compila las fuentes necesarias para subirlas a lambda.

    - deploy: Crea la funcion inicial en lambda con el zip compilado, se debe ajustar los parametros según el caso
    - runtime: version de nodejs.
    - zip-file: nombre del zip.
    - role: rol creado en AWS.

    - upload: Actualiza la funcion lambda.

    - Clean: Elimina el zip generado.

5. En caso se requiera editar la lógica revisar api/services/sms.service.js, este contiene el consumo de la API de cliente.

6. Existen metodos que sirven para probar que el API este desplegada correctamente, estos son:

    ```{url}/api/```
    ```{url}/api/test```

7. El metodo de envio es:

    ```{url}/api/send```

8. Estructura del body que espera el metodo send:

    ```json
    {
        "message":{
            "text": "Prueba Inconcert"
        },
        "addresses":[
            "51965260488"
        ]

    }
    ```

9. Respuesta del metodo send:

    ```json
    {
        "status": true,
        "reason": "",
        "addresses": {
            "51965260488": {
                "status": "SEND",
                "reason": ""
            }
        }
    }
    ```

### CONFIGURAR API GATEWAY

La configuración de API Gateway se puede realizar en la interfaz de AWS bajo los parametros que sean requeridos.

1. Crear API de tipo REST API, colocar el nombre y una descripcion. Seleccionar el tipo Regional.

2. Crear un recurso, marcar el tipo "Proxy resource", dejar el Resource path en /, en resource name colocar {my_proxy+} o lo que requieran, habilitar CORS y crear.

3. Ir al metodo ANY configurado, en el apartado de Integracion dar click y configurar la integración. En esta configuración seleccionar la opción Proxy, lambda, dejar las demas configuraciones por defecto y dar aceptar.

4. Validar que en el apartado "Integration response" figure con "Proxy Integration".

5. Probar los metodos con Postman.

Para mayor informacion de la configuracion de AWS, la guia que se siguio toma las pautas para configurar:

- Politica.
- Rol.
- AWS Lambda.
- API Gateway.

De la siguiente fuente:
[Docs AWS](https://docs.aws.amazon.com/es_es/lambda/latest/dg/services-apigateway-tutorial.html)

## SEGURIDAD DE FILTRADO POR IP QUE LLAMA AL METODO

- Pendiente
