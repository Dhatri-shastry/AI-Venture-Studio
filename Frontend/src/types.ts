/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AppScreen {
  Landing = 'landing',
  Dashboard = 'dashboard',
  Chatbot = 'chatbot',
  Login = 'login',
  SignUp = 'signup',
}

export type Theme = 'light' | 'dark';

export interface FeatureItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface IncludedCapability {
  label: string;
  category: 'core' | 'strategy' | 'execution';
}

export interface ConnectionNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'action' | 'resource' | 'agent';
}

export interface ConnectionLink {
  from: string;
  to: string;
}
