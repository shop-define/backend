## Command for PrismaORM

```sh
## prisma-studio
npx prisma studio

## prisma migrate up
npx prisma migrate dev --name init
```

## Локальная разработка

### Запуск

```sh
docker-compose up -d
```

### Пересборка

```sh
docker-compose up --build
```

### Миграция БД

```sh
docker-compose exec backend-define npx prisma migrate dev --name init
```
