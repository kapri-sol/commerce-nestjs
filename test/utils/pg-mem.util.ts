import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

export const getMemDateSource = async (entities: EntityClassOrSchema[]) => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  // db.registerExtension('uuid-ossp', (schema) => {
  //   schema.registerFunction({
  //     name: 'uuid_generate_v4',
  //     returns: DataType.uuid,
  //     implementation: v4,
  //     impure: true,
  //   });
  // });

  // db.public.interceptQueries((queryText) => {
  //   if (queryText.search(/(pg_views|pg_matviews|pg_tables|pg_enum)/g) > -1) {
  //     return [];
  //   }
  //   return null;
  // });

  // db.public.interceptQueries((queryText) => {
  //   if (
  //     queryText ===
  //     `SELECT columns.*, pg_catalog.col_description(('"' || table_catalog || '"."' || table_schema || '"."' || table_name || '"')::regclass::oid, ordinal_position) AS description, ('"' || "udt_schema" || '"."' || "udt_name" || '"')::"regtype" AS "regtype", pg_catalog.format_type("col_attr"."atttypid", "col_attr"."atttypmod") AS "format_type" FROM "information_schema"."columns" LEFT JOIN "pg_catalog"."pg_attribute" AS "col_attr" ON "col_attr"."attname" = "columns"."column_name" AND "col_attr"."attrelid" = ( SELECT "cls"."oid" FROM "pg_catalog"."pg_class" AS "cls" LEFT JOIN "pg_catalog"."pg_namespace" AS "ns" ON "ns"."oid" = "cls"."relnamespace" WHERE "cls"."relname" = "columns"."table_name" AND "ns"."nspname" = "columns"."table_schema" ) WHERE ("table_schema" = 'public' AND "table_name" = 'order') OR ("table_schema" = 'public' AND "table_name" = 'seller') OR ("table_schema" = 'public' AND "table_name" = 'product') OR ("table_schema" = 'public' AND "table_name" = 'customer') OR ("table_schema" = 'public' AND "table_name" = 'account')`
  //   ) {
  //     return [];
  //   }
  //   return null;
  // });

  db.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgreSQL 14.2',
  });

  // db.public.registerFunction({
  //   name: 'jsonb_typeof',
  //   args: [DataType.jsonb],
  //   returns: DataType.text,
  //   implementation: (x) => (x ? x.constructor.name : null),
  // });

  const datasource: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities,
    // logging: true,
    bigNumberStrings: true,
    supportBigNumbers: true,
    keepConnectionAlive: true,
  });
  await datasource.initialize();
  await datasource.synchronize();

  const backup = await db.backup();

  return { datasource, backup };
};
