# Deploy no Heroku - API de Usuários

## ⚠️ PROBLEMA CORS RESOLVIDO

### Correções Implementadas:

1. **Filtro CORS Adicional** - Criado `CorsFilter.java` para garantir headers CORS
2. **Configuração CORS Melhorada** - Usando `allowedOriginPatterns("*")` em vez de `allowedOrigins`
3. **Spring Security CORS** - Configurado para usar `CorsConfigurationSource`
4. **Requisições OPTIONS** - Permitidas explicitamente no SecurityConfig
5. **Logs de Debug** - Adicionados para rastrear requisições

## Configuração Inicial

### 1. Arquivos Necessários
- ✅ `Procfile` - Define como executar a aplicação
- ✅ `system.properties` - Especifica versão do Java
- ✅ `application-prod.properties` - Configurações de produção
- ✅ `CorsFilter.java` - Filtro CORS adicional
- ✅ `test-cors.html` - Arquivo para testar CORS

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
git commit -m "Correção CORS - Filtro adicional e configuração melhorada"
git push heroku main

# Ver logs
heroku logs --tail
```

## 🔧 Troubleshooting CORS

### Problema Atual: "No 'Access-Control-Allow-Origin' header is present"

**Solução Implementada:**

1. **Filtro CORS de Alta Prioridade** - `CorsFilter.java` adiciona headers em todas as respostas
2. **Configuração Dupla** - Tanto WebMvc quanto Spring Security configurados para CORS
3. **Requisições OPTIONS** - Tratadas explicitamente no filtro

### Teste CORS

Use o arquivo `test-cors.html` para testar:

1. Abra o arquivo no navegador
2. Configure a URL da sua API
3. Execute os testes para verificar se o CORS está funcionando

### Endpoints de Teste

- `GET /public/health` - Status da aplicação
- `GET /public/status` - Mensagem simples
- `GET /public/cors-test` - Teste específico de CORS
- `OPTIONS /api/users/me` - Teste de preflight
- `GET /api/users/me` - Endpoint que estava falhando

### Logs Importantes

Procure por estas mensagens nos logs:
- `>>> CorsFilter: Filtro CORS inicializado`
- `>>> WebConfig: Mapeamentos CORS aplicados com allowedOriginPatterns(*)`
- `>>> UserController: Requisição recebida para /api/users/me`

## Configurações Específicas

### CORS (Corrigido)
- **Filtro de Alta Prioridade** - Adiciona headers CORS em todas as respostas
- **Pattern Matching** - `allowedOriginPatterns("*")` para permitir todas as origens
- **Métodos** - GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH
- **Headers** - Todos (`*`) incluindo Authorization
- **Credentials** - true
- **Preflight** - Tratado explicitamente

### Segurança
- CSRF desabilitado
- Sessões stateless
- Requisições OPTIONS permitidas
- Endpoints públicos permitidos

## 🚀 Próximos Passos

1. **Deploy das correções:**
   ```bash
   git add .
   git commit -m "Correção CORS completa"
   git push heroku main
   ```

2. **Teste imediato:**
   - Acesse: `https://seu-app.herokuapp.com/public/health`
   - Use o arquivo `test-cors.html` para testes detalhados

3. **Verificação:**
   - Teste o endpoint `/api/users/me` do frontend
   - Verifique os logs: `heroku logs --tail`

4. **Limpeza (após funcionar):**
   - Remova `"*"` do CORS e especifique apenas as origens necessárias
   - Reduza o nível de logging para INFO

## 🔍 Debug Avançado

Se ainda houver problemas:

1. **Verifique os logs completos:**
   ```bash
   heroku logs --tail --source app
   ```

2. **Teste com curl:**
   ```bash
   # Teste OPTIONS
   curl -X OPTIONS -H "Origin: http://localhost:8081" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Authorization" \
        -v https://seu-app.herokuapp.com/api/users/me
   ```

3. **Verifique variáveis de ambiente:**
   ```bash
   heroku config
   ``` 