# Corrente

Aplicativo de encontros para surfistas, com descoberta de perfis por cartões, comunidade seletiva, matches, mensagens e cadastro com até três fotos.

## Funcionalidades

- Descoberta de perfis e curtidas
- Perfil autenticado com Sign in with ChatGPT
- Cadastro com nome, nascimento, cidade, nível de surfe e biografia
- Upload de 1 a 3 fotos em JPG, PNG ou WebP
- Armazenamento persistente de perfis no Cloudflare D1
- Armazenamento das fotos no Cloudflare R2
- Interface responsiva para celular e computador

## Tecnologias

- React 19 e TypeScript
- Next.js/Vinext
- Cloudflare Workers, D1 e R2
- Drizzle ORM
- Tailwind CSS

## Requisitos

- Node.js 22.13 ou superior
- PNPM ou NPM
- Ambiente compatível com Cloudflare Workers

## Executar localmente

```bash
pnpm install
pnpm dev
```

Para validar a versão de produção:

```bash
pnpm build
```

## Banco de dados

O esquema fica em `db/schema.ts`. Após alterações, gere uma nova migração:

```bash
pnpm db:generate
```

## Configuração

O projeto espera dois recursos da Cloudflare:

- `DB`: banco D1 para perfis e metadados
- `UPLOADS`: bucket R2 para as fotos

Use `.openai/hosting.example.json` como referência para sua configuração de hospedagem. Não publique identificadores privados de projetos existentes.

## Estrutura principal

- `app/CorrenteApp.tsx`: experiência principal
- `app/api/profile/route.ts`: cadastro e upload das fotos
- `app/api/photos/[id]/route.ts`: entrega segura das imagens
- `db/schema.ts`: esquema persistente
- `worker/index.ts`: aplicação no Cloudflare Worker

## Licença

Defina a licença adequada antes de distribuir publicamente o projeto.
