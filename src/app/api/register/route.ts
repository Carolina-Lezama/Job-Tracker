/*
encargado de registrar a los usuarios nuevos
Ctrl + Shift + P + Developer: Reload Window; volver a cargar VSC
*/
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Extraemos los datos que nos envía el formulario
    const body = await request.json();
    const { name, email, password } = body;

    // Validación básica
    if (!email || !password) {
      return NextResponse.json({ message: "Email y contraseña son requeridos" }, { status: 400 });
    }

    // 2. Verificamos si el correo ya existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Este correo ya está registrado" }, { status: 409 });
    }

    // 3. Transformación: Encriptamos la contraseña (¡nunca la guardamos en texto plano!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Carga: Guardamos el nuevo usuario en PostgreSQL usando Prisma
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Usuario creado exitosamente", user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Ocurrió un error en el servidor" }, { status: 500 });
  }
}