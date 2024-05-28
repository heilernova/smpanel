-- Author: Heiler Nova

drop schema public cascade;
create schema public;

create extension pgcrypto;
create extension unaccent;

create domain cellphone as
varchar check (value ~* '^\+\d+ \d{3} \d{3} \d{4}$');

create domain email as varchar(100)
check (value ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

create type user_role as enum('admin', 'user');
create type user_status as enum('active', 'inactive', 'lock');

create domain hex_id as char(12) check (value ~* '[0-9a-fA-F]{8}');

-- Generar un id hexadecimal de 12 caracteres
create function gen_random_hex_id()
returns hex_id language plpgsql as $$
begin
    return encode(gen_random_bytes(6), 'hex');
end;$$;

create table users
(
    "id" hex_id primary key default gen_random_hex_id(),
    "create_at" timestamp not null default now(),
    "role" user_role not null default 'user',
    "status" user_status not null default 'active',
    "username" varchar(30) not null,
    "name" varchar(40) not null,
    "last_name" varchar(40) not null,
    "email" email not null,
    "cellphone" cellphone,
    "permissions" text[] not null default array[]::text[],
    "password" text,
    constraint "uni_username" unique ("username"),
    constraint "uni_email" unique ("email")
);

-- User default
insert into users values(default, default, 'admin', 'active', 'admin', 'Admin', 'Admin', 'admin@admin.com', default, default, '$2b$10$9BWIHew0Alqz3WxwR.Hj9OVEgg1Jn75nCadoq13Mip6TleQeHXd1q');

create type user_log_action as enum('auth', 'update', 'password',  'lock');
create type user_log_state as enum('success', 'warning', 'error', 'bug');

create table users_log
(
    "id" uuid primary key default gen_random_uuid(),
    "create_at" timestamp not null default now(),
    "user_id" hex_id not null references users("id"),
    "action" user_log_action not null,
    "state" user_log_state not null,
    "detail" varchar(80) not null
);

create type token_type as enum('web', 'cli');
create type token_device as enum('desktop', 'mobile', 'table');
create table users_tokens
(
    "id" uuid default gen_random_uuid(),
    "create_at" timestamp not null default now(),
    "user_id" hex_id not null references users("id"),
    "type" token_type not null,
    "hostname" varchar(50) not null,
    "ip" varchar(30),
    "device" token_device,
    "platform" varchar(20),
    "exp" timestamp,
    constraint "pk_id_hostname" primary key ("user_id", "type", "hostname")
);


create type runtime_environment as enum('Node.js', 'Python', 'PHP', 'GO');
create type framework as enum('NestJS', 'Angular', 'FastAPI');
create type running_on as enum('PM2', 'Docker', 'LiteSpeed', 'Apache');

create table apps
(
    "id" hex_id primary key default gen_random_hex_id(),
    "create_at" timestamp not null default now(),
    "update_at" timestamp not null default now(),
    "last_deploy_at" timestamp,
    "domain" varchar(100) not null,
    "name" varchar(50) not null,
    "version" varchar(10),
    "location" varchar(600) not null unique,
    "startup_file" varchar(50),
    "framework" framework default null,
    "running_on" running_on default null,
    "runtime_environment" runtime_environment default null,
    "url" varchar(100),
    "repository" json,
    "env" json not null default '{}'::json,
    "ignore" text[] not null default array[]::text[],
    "observation" varchar(1000),
    constraint "uni_domain_name" unique ("domain", "name", "version")
);

create table apps_users
(
    "app_id" hex_id not null,
    "user_id" hex_id not null,
    "permissions" text[] not null
);

create type app_log_type as enum('error', 'reset', 'deploy', 'stop', 'start');
create table apps_log
(
    "id" uuid primary key default gen_random_uuid(),
    "create_at" timestamp not null default now(),
    "app_id" hex_id not null,
	"user_id" hex_id not null,
    "type" app_log_type not null,
    "detail" varchar(100) not null,
	"data" json default null
);

-------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------
--- Foreign keys
-------------------------------------------------------------------------------------------------------------------------------------

alter table users_log
    add constraint fk_users_log__users
    foreign key (user_id)
    references users(id)
    on delete cascade;

alter table users_tokens
    add constraint fk_users_tokens__users
    foreign key (user_id)
    references users(id)
    on delete cascade;

alter table apps_users
    add constraint fk_apps_users__users
    foreign key (app_id)
    references apps(id)
    on delete cascade;

alter table apps_log
    add constraint fk_apps_users__users
    foreign key (app_id)
    references apps(id)
    on delete cascade;