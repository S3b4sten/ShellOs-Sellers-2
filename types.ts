import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  uv: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Attribute {
  key: string;
  value: string;
}

export interface ListingData {
  title: string;
  description: string;
  condition: string; // Mandatory field
  price: number;
  category: string;
  attributes: Attribute[];
}

export interface InventoryItem {
  id: string;
  title: string;
  category: string;
  condition: string; // Mandatory field
  price: number;
  status: 'FOR_SALE' | 'SOLD';
  dateAdded: string;
  imageUrl?: string;
  attributes?: Attribute[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

export interface AppSettings {
  emailNotifications: boolean;
  autoPublish: boolean;
  darkMode: boolean;
  compactMode: boolean;
  currency: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export enum DashboardView {
  OVERVIEW = 'OVERVIEW',
  NEW_LISTING = 'NEW_LISTING',
  ANALYTICS = 'ANALYTICS',
  ASSISTANT = 'ASSISTANT',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE'
}