// src/api/campaign.ts
import apiClient from './apiClient';
import { Campaign } from './types';

export const getAllCampaigns = async (): Promise<Campaign[]> => {
  const { data } = await apiClient.get('/api/campaigns');
  return data;
};

export const getAllCampaignsRoute = async (): Promise<Campaign[]> => {
  const { data } = await apiClient.get('/api/campaigns/all');
  return data;
};

export const getCampaignById = async (id: string): Promise<Campaign> => {
  const { data } = await apiClient.get(`/api/campaigns/${id}`);
  return data;
};

export const updateCampaign = async (id: any, update: any): Promise<Campaign> => {
  const { data } = await apiClient.put(`/api/campaigns/${id}`, update);
  return data;
};

export const updateCampaignClose = async (id: any,): Promise<Campaign> => {
  const { data } = await apiClient.put(`/api/campaigns/close/${id}`);
  return data;
};

export const checkCampaign = async () => {
  const { data } = await apiClient.get(`/api/campaigns/check`);
  return data;
};

export const createCampaign = async (campaign: Campaign): Promise<Campaign> => {
  const { data } = await apiClient.post('/api/campaigns/create', campaign);
  return data;
};
