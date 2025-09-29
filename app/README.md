# <YOUR_RECIPE_AGENT_SAAS>

Built with [Wasp](https://wasp.sh) and [Mastra AI](https://mastra.ai), based on the [Open Saas](https://opensaas.sh) template.

## Development

### Running locally

 - Make sure you have [Wasp](https://wasp.sh) installed:
 ```bash
 curl -sSL https://get.wasp.sh/installer.sh | sh
 ```
 - Copy the `.env.client` and `.env.server` files:
```bash
cp .env.server.example .env.server && cp .env.client.example .env.client
```
 - Fill in the needed env vars in the `.env.server` file:
  - AWS S3 credentials
  - OpenAI API key
 - Run the database with `wasp start db` and leave it running (docker must be installed and running).
 - Run `wasp start` and leave it running.
 - [OPTIONAL]: If this is the first time starting the app, or you've just made changes to your entities/prisma schema, also run `wasp db migrate-dev`.

🤠 See the [Open SaaS docs](https://docs.opensaas.sh) for full instructions and integration guides!
