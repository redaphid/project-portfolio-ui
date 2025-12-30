export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Static assets are served automatically via the assets directory in wrangler.jsonc
		// This handler is for any API routes or fallback behavior
		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;
