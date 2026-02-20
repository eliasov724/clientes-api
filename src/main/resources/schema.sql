-
DROP TABLE IF EXISTS clientes;

CREATE TABLE clientes (
                          id BIGSERIAL PRIMARY KEY,

                          nombre VARCHAR(100) NOT NULL,
                          apellido VARCHAR(100) NOT NULL,
                          razon_social VARCHAR(150) NOT NULL,

                          cuit VARCHAR(20) NOT NULL UNIQUE,

                          fecha_nacimiento DATE NOT NULL,
                          telefono_celular VARCHAR(30) NOT NULL,

                          email VARCHAR(150) NOT NULL UNIQUE,

                          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO clientes (
    nombre,
    apellido,
    razon_social,
    cuit,
    fecha_nacimiento,
    telefono_celular,
    email
) VALUES
      ('Juan', 'Pérez', 'JP Servicios SRL', '20-12345678-9', '1990-05-10', '1122334455', 'juan@jp.com'),
      ('María', 'Gómez', 'MG Soluciones', '27-23456789-0', '1985-08-15', '1133445566', 'maria@mg.com'),
      ('Carlos', 'López', 'CL Construcciones', '23-34567890-1', '1978-02-20', '1144556677', 'carlos@cl.com'),
      ('Lucía', 'Martínez', 'LM Consultora', '27-45678901-2', '1992-11-03', '1155667788', 'lucia@lm.com'),
      ('Diego', 'Fernández', 'DF Diseño', '20-56789012-3', '1988-07-22', '1166778899', 'diego@df.com');