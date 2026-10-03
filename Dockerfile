FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM node:20 AS build-node
WORKDIR /app
COPY nannyapp-ui/package.json nannyapp-ui/package-lock.json ./
RUN npm ci
COPY nannyapp-ui/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["NannyApp.API/NannyApp.API.csproj", "NannyApp.API/"]
RUN dotnet restore "NannyApp.API/NannyApp.API.csproj"
COPY NannyApp.API/ NannyApp.API/
WORKDIR "/src/NannyApp.API"
RUN dotnet build "NannyApp.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "NannyApp.API.csproj" -c Release -o /app/publish /p:UseAppHost=false
# Copy React build to wwwroot
COPY --from=build-node /app/dist /app/publish/wwwroot

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NannyApp.API.dll"]
