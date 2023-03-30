create database purchase_requisition;

create table users (
  id serial primary key,
  name varchar(100) not null,
  email varchar(100) unique,
  password varchar(150),
  approver boolean,
  purchaser boolean,
  warehouse_officer boolean,
  admin boolean,
  status varchar(20)
  );

create table cost_centers (
  id serial primary key,
  code varchar(10) not null,
  description varchar(100),
  accountable_id integer references users(id),
  status varchar(20)
);

create table measurement_units (
  id char(3) primary key,
  description varchar(50),
  status varchar(20)
);

create table suppliers (
  id serial primary key,
  company varchar(50),
  trade varchar(50),
  cnpj varchar(50),
  phone_number varchar(50),
  contact varchar(50),
  postal_code varchar(50),
  address varchar(100),
  ad_number varchar(10),
  ad_city varchar(100),
  ad_state char(2),
  ad_country varchar(100),
  status varchar(20)
);

create table supplier_orders (
  id serial primary key,
  sp_number integer,
  supplier_id integer references suppliers(id),
  note text,
  image text,
  issued_on timestamp,
  bought_by_id integer references users(id),
  status varchar(20)
);

create table requisitions (
  id serial primary key,
  urgent boolean,
  note text,
  created_at timestamp,
  created_by_id integer references users(id),
  updated_at timestamp,
  updated_by_id integer references users(id),
  canceled_at timestamp,
  canceled_by_id integer references users(id),
  approved_at timestamp,
  bought_by_id integer references users(id),
  bought_at timestamp,
  cost_center_id integer references cost_centers(id),
  image text,
  status varchar(20)
);

ALTER SEQUENCE requisitions_id_seq RESTART WITH 10000;

create table requisition_items (
  id serial primary key,
  requisition_id integer references requisitions(id),
  description text,
  quantity integer,
  unity_id char references measurement_units(id),
  status varchar(50),
  supplier_order_id integer references supplier_orders(id)
 );