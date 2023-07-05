# Migrations 
```mermaid
graph TD;
DB_old_state-->|migrate|DB_new_state
```
## Model / Entity-First Migration:
----------
> Das Datenbankschema wird in Code defininiert und durch das Migrationstool Prisma Migration in SQL umgewandelt. 

```mermaid
graph TD;
Entwickler-->|updatet Model und Entitäten| Code;
Entwickler-->|erzeugt und benutzt Migration| CLI;
CLI-->|erzeugt SQL-Code zum Update| Datenbank;
```

## Database-first migration:
----------
```mermaid
flowchart TD;
Entwickler-->|1. defininert SQL-Migration| Code;
Code-->|2. wird auf Datenbank angewandt| Datenbank;
Entwickler-->|3. betrachtet| Datenbank;
Entwickler-->|4. Entwickelt Model und erzeugt Entitäten| Prisma
```
> Der Entwickler erzeugt zuerst die Datenbank und passt die Models dann an die Datenbank an. 

# Datenbank aktualisieren
## Lokal
Zur Änderung der Datenbank wird das Model geändert:
```mermaid
graph TD;
Model-->prisma_migrate_dev;
prisma_migrate_dev-->|tracks state in migrations| Database;
````

