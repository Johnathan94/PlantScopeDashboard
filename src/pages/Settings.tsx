import React, { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { Header } from '../components/layout';
import { Card, Button, Input, Select, Toggle } from '../components/ui';
import { useSettingsStore } from '../store/settingsStore';

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const roleOptions = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
];

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      resetSettings();
      setLocalSettings({
        siteName: 'Admin Panel',
        siteDescription: 'Manage your application',
        maintenanceMode: false,
        allowRegistration: true,
        defaultRole: 'viewer',
        emailNotifications: true,
        theme: 'system',
      });
    }
  };

  return (
    <div>
      <Header title="Settings" />
      <div className="p-8 max-w-4xl">
        <div className="space-y-6">
          <Card title="General Settings">
            <div className="space-y-4">
              <Input
                label="Site Name"
                value={localSettings.siteName}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, siteName: e.target.value })
                }
              />
              <Input
                label="Site Description"
                value={localSettings.siteDescription}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, siteDescription: e.target.value })
                }
              />
              <Select
                label="Theme"
                options={themeOptions}
                value={localSettings.theme}
                onChange={(value) =>
                  setLocalSettings({
                    ...localSettings,
                    theme: value as 'light' | 'dark' | 'system',
                  })
                }
              />
            </div>
          </Card>

          <Card title="User Settings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Allow Registration</p>
                  <p className="text-sm text-gray-500">
                    Allow new users to register on the platform
                  </p>
                </div>
                <Toggle
                  checked={localSettings.allowRegistration}
                  onChange={(checked) =>
                    setLocalSettings({ ...localSettings, allowRegistration: checked })
                  }
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <Select
                  label="Default Role for New Users"
                  options={roleOptions}
                  value={localSettings.defaultRole}
                  onChange={(value) =>
                    setLocalSettings({
                      ...localSettings,
                      defaultRole: value as 'editor' | 'viewer',
                    })
                  }
                />
              </div>
            </div>
          </Card>

          <Card title="Notifications">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive email notifications for important events
                </p>
              </div>
              <Toggle
                checked={localSettings.emailNotifications}
                onChange={(checked) =>
                  setLocalSettings({ ...localSettings, emailNotifications: checked })
                }
              />
            </div>
          </Card>

          <Card title="Maintenance">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-500">
                  Enable maintenance mode to restrict access to the site
                </p>
              </div>
              <Toggle
                checked={localSettings.maintenanceMode}
                onChange={(checked) =>
                  setLocalSettings({ ...localSettings, maintenanceMode: checked })
                }
              />
            </div>
            {localSettings.maintenanceMode && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Maintenance mode is enabled. Only admins can access the site.
                </p>
              </div>
            )}
          </Card>

          <div className="flex items-center justify-between pt-4">
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <div className="flex items-center gap-4">
              {saved && (
                <span className="text-sm text-green-600">Settings saved successfully!</span>
              )}
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
