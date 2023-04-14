import { rest } from 'msw'


export const handlers = [
  rest.get('/reviews', (_req, res, ctx) => {
    return res(
      ctx.json([
        {
            success: true,
        },
      ])
    )
  }),
]