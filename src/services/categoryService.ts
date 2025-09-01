import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const createOneCategory = async (data: any) => {
  return prisma.category.create({
    data,
  });
};

export const getCategoryByName = async (name: string) => {
  return prisma.category.findUnique({
    where: { name },
  });
};

export const getCategoryById = async (id: number) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const updateOneCategory = async (id: number, data: any) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};
