import React, { createContext, useContext, useEffect, useState } from 'react';
import { contentApi } from '../api/contentApi';

export interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  whatsapp: string;
  currency: string;
  rawSettings: Record<string, string>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: CompanySettings = {
  name: 'Soft Solutions',
  email: 'manishkiran8464@gmail.com',
  phone: '+91 8464992957',
  address: 'Rc puram Hyd',
  workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
  whatsapp: '+91 8464992957',
  currency: 'INR (₹)',
  rawSettings: {},
  refreshSettings: async () => {},
};

const SettingsContext = createContext<CompanySettings>(defaultSettings);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);

  const fetchSettings = async () => {
    try {
      const data = await contentApi.getSettings();
      const name = data['Company:Name'] || 'Soft Solutions';
      const email = data['Company:Email'] || 'manishkiran8464@gmail.com';
      const phone = data['Company:Phone'] || '+91 8464992957';
      const address = data['Company:Address'] || 'Rc puram Hyd';
      const workingHours = data['Company:WorkingHours'] || 'Mon - Sat: 9:00 AM - 8:00 PM IST';
      const whatsapp = data['Company:WhatsApp'] || phone;
      const currency = data['Finance:Currency'] || 'INR (₹)';

      setSettings({
        name,
        email,
        phone,
        address,
        workingHours,
        whatsapp,
        currency,
        rawSettings: data,
        refreshSettings: fetchSettings,
      });
    } catch (err) {
      console.error('Failed to load company settings', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useCompanySettings = () => useContext(SettingsContext);
