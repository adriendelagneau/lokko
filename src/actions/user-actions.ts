"use server";


import { getUser } from "@/lib/auth/auth-session";
import prisma from "@/lib/prisma/prisma";



export async function getUserRole() {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, email: true, role: true },
    });

    if (!dbUser) {
        throw new Error("User not found");
    }

    return {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
    };
}



export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            where: {
                author: null, // only users who aren't already authors
            },
            select: {
                id: true,
                email: true,

            },
        });

        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}