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

/******************* */


export async function getUserConversations() {

    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    
    const userId = user.id;
    const conversations = await prisma.conversation.findMany({
        where: {
            OR: [
                { contactUserId: userId },
                { participants: { some: { userId } } },
            ],
        },
        include: {
            listing: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    images: { take: 1, select: { url: true, altText: true } },
                },
            },
            contactUser: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            participants: {
                where: { userId: { not: userId } }, // get the other participant
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1, // last message
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    senderId: true,
                },
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return conversations;
}