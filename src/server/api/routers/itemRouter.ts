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
        .mutation(async ({ input, ctx }) => {
            const { name } = input
            const item = await ctx.prisma.item.create({
                data: {
                    name
                },
            })
            return item
        }),
    getAllItems: publicProcedure
        .query(async ({ ctx }) => {
            const items = await ctx.prisma.item.findMany({
                orderBy: {
                    index: 'asc',
                }
            })

            return items

        }),
    deleteItem: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { id } = input
            const item = await ctx.prisma.item.delete({
                where: {
                    id,
                },
            })
            return item
        }),
    toggleCheck: publicProcedure
        .input(z.object({
            id: z.number(),
            checked: z.boolean(),
        }))
        .mutation(async ({ input, ctx }) => {
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
        }),
    deleteAllItems: publicProcedure
        .mutation(async ({ ctx }) => {
            const items = await ctx.prisma.item.deleteMany({})
            return items
        }),
    updateOrder: publicProcedure
        .input(z.object({
            array: z.any(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { array } = input;
            const updates = array.map((item, i) => ({
                
                    where: {
                        id: item.id
                    },
                    data: {
                        index: i + 1,
                    },
                
            }));
            
            const results = await ctx.prisma.$transaction(updates.map((update) => ctx.prisma.item.update(update)));
            console.log(results);
            return results;
        }),
    })