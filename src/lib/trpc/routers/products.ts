import { z } from 'zod'
import { router, protectedProcedure, publicProcedure } from '../init'
import { TRPCError } from '@trpc/server'

const productPackageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().positive(),
  features: z.array(z.string()),
  is_recommended: z.boolean().default(false),
  order_index: z.number().int().default(0),
  is_active: z.boolean().default(true),
})

const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string(),
  description: z.string().optional(),
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  hero_problem: z.string().optional(),
  base_price: z.number().int().nonnegative().default(0),
  features: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  documents_required: z.array(z.string()).default([]),
  faq_items: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).default([]),
  is_active: z.boolean().default(true),
})

export const productsRouter = router({
  // Público - listar produtos ativos
  list: publicProcedure
    .input(z.object({
      category: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx

      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (input?.category) {
        query = query.eq('category', input.category)
      }

      const { data, error } = await query

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return data
    }),

  // Público - buscar produto por slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx

      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', input.slug)
        .eq('is_active', true)
        .single()

      if (error || !product) throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Produto não encontrado',
      })

      return product
    }),

  // Público - buscar pacotes de um produto
  getPackages: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx

      const { data, error } = await supabase
        .from('product_packages')
        .select('*')
        .eq('product_id', input.productId)
        .eq('is_active', true)
        .order('order_index')

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return data
    }),

  // Admin - listar todos (incluindo inativos)
  adminList: protectedProcedure
    .query(async ({ ctx }) => {
      const { supabase } = ctx

      const { data, error } = await supabase
        .from('products')
        .select('*, product_packages(*)')
        .order('created_at', { ascending: false })

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return data
    }),

  // Admin - criar produto
  create: protectedProcedure
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx

      const { data, error } = await supabase
        .from('products')
        .insert(input)
        .select()
        .single()

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return data
    }),

  // Admin - atualizar produto
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: productSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx

      const { data, error } = await supabase
        .from('products')
        .update(input.data)
        .eq('id', input.id)
        .select()
        .single()

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return data
    }),

  // Admin - deletar produto
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', input.id)

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return { success: true }
    }),

  // Admin - criar pacote
  createPackage: protectedProcedure
    .input(z.object({
      product_id: z.string(),
      package: productPackageSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx

      const { data, error } = await supabase
        .from('product_packages')
        .insert({
          product_id: input.product_id,
          ...input.package,
        })
        .select()
        .single()

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return data
    }),

  // Admin - atualizar pacote
  updatePackage: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: productPackageSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx

      const { data, error } = await supabase
        .from('product_packages')
        .update(input.data)
        .eq('id', input.id)
        .select()
        .single()

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return data
    }),

  // Admin - deletar pacote
  deletePackage: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx

      const { error } = await supabase
        .from('product_packages')
        .delete()
        .eq('id', input.id)

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return { success: true }
    }),
})
