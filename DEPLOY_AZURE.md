# Deployment Guide - Azure

This guide covers deploying the Nest Rental app to Azure using App Service and Cosmos DB (MongoDB).

## Prerequisites

- Azure subscription (free tier available)
- Azure CLI installed: `https://learn.microsoft.com/en-us/cli/azure/install-azure-cli`
- Docker installed (optional, for container deployment)

## Step 1: Create Resource Group

```bash
az group create \
  --name nest-rental-rg \
  --location eastus
```

## Step 2: Create Cosmos DB (MongoDB)

```bash
az cosmosdb create \
  --resource-group nest-rental-rg \
  --name nest-rental-db \
  --kind MongoDB \
  --locations regionName=eastus \
  --default-consistency-level Strong

# Get connection string
az cosmosdb keys list \
  --resource-group nest-rental-rg \
  --name nest-rental-db \
  --type connection-strings
```

Copy the connection string and save it.

## Step 3: Create App Service Plan

```bash
az appservice plan create \
  --name nest-rental-plan \
  --resource-group nest-rental-rg \
  --sku B1 \
  --is-linux
```

## Step 4: Create Backend App Service

```bash
# Create web app for backend
az webapp create \
  --resource-group nest-rental-rg \
  --plan nest-rental-plan \
  --name nest-rental-api \
  --runtime "NODE|18-lts"

# Set environment variables
az webapp config appsettings set \
  --resource-group nest-rental-rg \
  --name nest-rental-api \
  --settings \
    NODE_ENV=production \
    MONGODB_URI="<your-connection-string>" \
    JWT_SECRET="<your-secret-key>" \
    CORS_ORIGIN="https://nest-rental-web.azurewebsites.net"
```

## Step 5: Create Frontend App Service

```bash
# Create static web app for frontend
az staticwebapp create \
  --name nest-rental-web \
  --resource-group nest-rental-rg \
  --source https://github.com/<your-username>/nest-rental-app \
  --location eastus \
  --branch main \
  --app-location "frontend" \
  --output-location "build" \
  --token "<your-github-token>"
```

## Step 6: Deploy Backend Using Git

```bash
# Configure deployment
az webapp deployment source config-zip \
  --resource-group nest-rental-rg \
  --name nest-rental-api \
  --src backend.zip
```

Or using GitHub Actions (recommended):

1. Add secrets to GitHub repository
2. Use the CI/CD pipeline to auto-deploy

## Step 7: Configure Custom Domain (Optional)

```bash
az webapp config hostname add \
  --resource-group nest-rental-rg \
  --webapp-name nest-rental-api \
  --hostname api.yourdomain.com

az staticwebapp secrets rotate \
  --name nest-rental-web \
  --resource-group nest-rental-rg
```

## Step 8: Enable SSL/TLS

Azure App Service automatically provides HTTPS with .azurewebsites.net domains.

For custom domains:

```bash
az webapp config ssl import \
  --resource-group nest-rental-rg \
  --name nest-rental-api \
  --certificate-file mycert.pfx \
  --certificate-password <password>
```

## Step 9: Monitor and Logs

```bash
# View logs
az webapp log tail \
  --resource-group nest-rental-rg \
  --name nest-rental-api

# Enable application insights
az monitor app-insights component create \
  --resource-group nest-rental-rg \
  --app nest-rental-insights
```

## Step 10: Backup and Recovery

```bash
# Create backup
az webapp config backup create \
  --resource-group nest-rental-rg \
  --name nest-rental-api
```

## Troubleshooting

### App won't start
- Check logs: `az webapp log tail`
- Verify environment variables are set correctly
- Check MongoDB connection string

### Database connection issues
- Verify Cosmos DB firewall allows App Service IP
- Check connection string format for MongoDB

### Performance issues
- Scale up App Service plan if needed: `az appservice plan update --sku S1`
- Enable caching and CDN for frontend

## Cost Estimation

- App Service Plan B1: ~$55/month
- Cosmos DB (shared throughput): ~$25/month
- Static Web App: Free tier available
- Total: ~$80-100/month

## Next Steps

1. Set up monitoring and alerts
2. Configure auto-scaling for production
3. Set up CI/CD pipeline with GitHub Actions
4. Configure custom domain with SSL
5. Set up email service (SendGrid or Amazon SES)
