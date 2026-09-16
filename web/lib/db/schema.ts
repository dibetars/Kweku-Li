import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(), // 'admin' | 'editor'
  createdAt: text('created_at').notNull(),
});

export const content = sqliteTable('content', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedBy: integer('updated_by'),
  updatedAt: text('updated_at').notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id'),
  action: text('action').notNull(), // 'create' | 'update'
  key: text('key'),
  before: text('before'),
  after: text('after'),
  createdAt: text('created_at').notNull(),
  ip: text('ip'),
});

export const submissions = sqliteTable('submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  service: text('service'),
  timeline: text('timeline'),
  budget: text('budget'),
  location: text('location'),
  message: text('message').notNull(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  status: text('status').notNull().default('new'), // 'new' | 'read' | 'replied' | 'archived'
  emailStatus: text('email_status'), // 'sent' | 'failed: <reason>'
  emailSentAt: text('email_sent_at'),
  createdAt: text('created_at').notNull(),
});
