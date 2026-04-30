/*
Route Handler (manejador de rutas)

Se encarga de recibir los datos del formulario de registro, procesarlos de forma segura y guardarlos en PostgreSQL.
Ctrl + Shift + P + Developer: Reload Window; volver a cargar VSC
*/
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient(); // Abre la conexión con la bd

export async function POST(request: Request) { // nombrar la función como POST significa que este archivo solo responderá cuando alguien le envíe datos
  try {
    const body = await request.json(); // convertir a formato JSON
    const { name, email, password } = body;

    if (!email || !password) { //NO campos vacios
      return NextResponse.json({ message: "Email y contraseña son requeridos" }, { status: 400 }); // Petición Incorrecta
    }

    const existingUser = await prisma.user.findUnique({ //tabla user
      where: { email: email },
    });

    if (existingUser) { //si existe entonces
      return NextResponse.json({ message: "Este correo ya está registrado" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // encriptar contraseña, ya veces una operacion matematica

    const newUser = await prisma.user.create({ // crear un nuevo registro en la fila
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Usuario creado exitosamente", user: newUser }, { status: 201 }); //accion exitosa
  } catch (error) {
    return NextResponse.json({ message: "Ocurrió un error en el servidor" }, { status: 500 }); //error en el servidor
  }
}