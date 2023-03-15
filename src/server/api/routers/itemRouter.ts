import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure
    
  } from "~/server/api/trpc";

export const itemRouter = createTRPCRouter({
    addItem: publicProcedure
        .input(z.object({
            name: z.string(),
        }))
        .mutation( async ({ input, ctx }) => {
            const { name } = input
            const item = await ctx.prisma.item.create({
                data: {
                    name
                },
            })
            return item
        }),
    getAllItems: publicProcedure
        .query( async ({ ctx }) => {
            const items = await ctx.prisma.item.findMany()
            return items
    
        }),
    deleteItem: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation( async ({ input, ctx }) => {
            const { id } = input
            const item = await ctx.prisma.item.delete({
                where: {
                    id,
                },
            })
            return item
        } ),
    toggleCheck: publicProcedure
        .input(z.object({
            id: z.string(),
            checked: z.boolean(),
        }))
        .mutation( async ({ input, ctx }) => {
            const { id, checked } = input
            const item = await ctx.prisma.item.update({
                where: {
                    id,
                },
                data: {
                    checked,
                },
            })
        return item
    } ),
    deleteAllItems: publicProcedure
        .mutation( async ({ ctx }) => {
            const items = await ctx.prisma.item.deleteMany({})
        return items
         } ),
    })