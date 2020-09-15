################################################
start:
	@deno run --allow-net --allow-read --allow-env --unstable mod.ts

reload:
	@deno run --reload --allow-net --allow-read --allow-env --unstable mod.ts

fmt:
	@deno fmt
