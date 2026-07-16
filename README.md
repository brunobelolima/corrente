# Corrente

Aplicativo de encontros para surfistas, com descoberta de perfis por cartões, comunidade seletiva, matches, mensagens e cadastro com até três fotos.

## Funcionalidades

- Descoberta de perfis e curtidas
- Grupos por local e data da próxima surftrip
- Perfil autenticado com Sign in with ChatGPT
- Cadastro com nome, nascimento, gênero, altura, intenção de relacionamento, consumo de bebida alcoólica, uso de cigarro, posicionamento político, estilo musical favorito, Instagram, Spotify, cidade, nível de surfe, próxima surftrip com chegada e saída, e biografia
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

## Demonstração no GitHub Pages

A pasta `docs/` contém uma versão estática pronta para GitHub Pages. Como Pages não executa o servidor, essa demonstração salva o perfil e até três fotos somente no navegador do visitante. A versão completa continua usando D1 e R2.

URL pública: `https://brunobelolima.github.io/corrente/`

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
