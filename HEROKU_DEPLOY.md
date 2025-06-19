# Deploy no Heroku - API de Usuários

## Configuração Inicial

### 1. Arquivos Necessários
- ✅ `Procfile` - Define como executar a aplicação
- ✅ `system.properties` - Especifica versão do Java
- ✅ `application-prod.properties` - Configurações de produção

### 2. Variáveis de Ambiente no Heroku

Configure as seguintes variáveis no painel do Heroku:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster/banco

# Email
EMAIL_USERNAME=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app

# Frontend URL (opcional)
FRONTEND_URL=https://seu-frontend.herokuapp.com

# Firebase (se necessário)
FIREBASE_PROJECT_ID=seu-projeto-id
```

### 3. Comandos para Deploy

```bash
# Login no Heroku CLI
heroku login

# Criar app (se não existir)
heroku create seu-app-name

# Configurar variáveis de ambiente
heroku config:set MONGODB_URI="sua-uri-mongodb"
heroku config:set EMAIL_USERNAME="seu-email"
heroku config:set EMAIL_PASSWORD="sua-senha"

# Deploy
git add .
git commit -m "Configuração para Heroku"
git push heroku main

# Ver logs
heroku logs --tail
```

## Troubleshooting

### Problemas Comuns

1. **Aplicação não inicia**
   - Verifique os logs: `heroku logs --tail`
   - Confirme se o `Procfile` está correto
   - Verifique se as variáveis de ambiente estão configuradas

2. **Requisições não chegam**
   - Teste o endpoint de health: `https://seu-app.herokuapp.com/public/health`
   - Verifique se a porta está correta (Heroku define via `PORT`)
   - Confirme se o CORS está configurado corretamente

3. **Erro de CORS**
   - A configuração atual permite todas as origens (`*`)
   - Para produção, especifique apenas as origens necessárias

### Endpoints de Teste

- `GET /public/health` - Status da aplicação
- `GET /public/status` - Mensagem simples
- `GET /public/` - Informações da API

### Logs Importantes

Procure por estas mensagens nos logs:
- `>>> WebConfig: Bean inicializado e carregado pelo Spring.`
- `>>> WebConfig: Mapeamentos CORS aplicados`
- `>>> FirebaseTokenFilter: Processando requisição`

## Configurações Específicas

### CORS
A configuração atual permite:
- Todas as origens (`*`) - para debug
- Métodos: GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH
- Headers: Todos (`*`)
- Credentials: true

### Segurança
- CSRF desabilitado
- Sessões stateless
- Todas as requisições permitidas (para debug)

## Próximos Passos

1. Teste os endpoints públicos
2. Configure as variáveis de ambiente
3. Faça o deploy
4. Teste com seu frontend
5. Remova `"*"` do CORS quando estiver funcionando 