'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { FaSun, FaMoon, FaDesktop, FaPalette, FaColumns, FaBell, FaCheck, FaCode, FaBolt } from 'react-icons/fa'
import { Switch } from '@headlessui/react'
import { toast } from 'react-hot-toast'

const COLORS = ['blue', 'green', 'purple', 'orange', 'pink', 'yellow', 'red', 'indigo', 'teal']
const THEMES = [
  { id: 'light', icon: FaSun, label: 'Light Mode' },
  { id: 'dark', icon: FaMoon, label: 'Dark Mode' },
  { id: 'system', icon: FaDesktop, label: 'System Default' }
]
const POSITIONS = [
  { id: 'top-right', label: 'Top Right' },
  { id: 'top-left', label: 'Top Left' },
  { id: 'bottom-right', label: 'Bottom Right' },
  { id: 'bottom-left', label: 'Bottom Left' }
]
const CARD_SIZES = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' }
]

const DEFAULT_SETTINGS = {
  theme: { mode: 'light', primaryColor: 'green', accentColor: 'blue' },
  layout: { compactMode: false, showGreeting: true, cardSize: 'medium', gridColumns: 3 },
  widgets: {
    blogs: {
      visible: true,
      order: 1,
      bgColor: 'blue',
      showDrafts: true,
      showPublished: true,
      showCount: true
    },
    projects: {
      visible: true,
      order: 2,
      bgColor: 'green',
      showActive: true,
      showCompleted: true,
      showCount: true
    },
    services: {
      visible: true,
      order: 3,
      bgColor: 'purple',
      showCount: true
    },
    experience: {
      visible: true,
      order: 4,
      bgColor: 'orange',
      showCount: true
    },
    education: {
      visible: true,
      order: 5,
      bgColor: 'pink',
      showCount: true
    },
    messages: {
      visible: true,
      order: 6,
      bgColor: 'yellow',
      showUnread: true,
      showTotal: true,
      showCount: true
    }
  },
  quickActions: {
    newBlog: { visible: true, order: 1, showDescription: true },
    newProject: { visible: true, order: 2, showDescription: true },
    manageServices: { visible: true, order: 3, showDescription: true },
    updateExperience: { visible: true, order: 4, showDescription: true },
    viewMessages: { visible: true, order: 5, showDescription: true },
    editProfile: { visible: true, order: 6, showDescription: true }
  },
  notifications: { showInDashboard: true, position: 'top-right', autoHide: true, duration: 5000 }
}

export default function DashboardSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('appearance')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/dashboard')
      const data = await response.json()
      if (data.success) {
        setSettings(prevSettings => ({
          ...DEFAULT_SETTINGS,
          ...data.data
        }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings/dashboard', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Settings saved successfully')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev }
      const parts = path.split('.')
      let current = newSettings
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]]
      }
      current[parts[parts.length - 1]] = value
      return newSettings
    })
  }

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
  }

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        activeTab === id
          ? 'bg-green-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </button>
  )

  const ColorPicker = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {COLORS.map(color => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-offset-2 hover:ring-${color}-500 ${
              value === color ? 'ring-2 ring-offset-2 ring-green-500' : ''
            }`}
          >
            {value === color && <FaCheck className="text-white mx-auto" />}
          </button>
        ))}
      </div>
    </div>
  )

  const SettingsSection = ({ title, items, section }) => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{title}</h3>
      {Object.entries(items || {}).map(([key, item]) => (
        <div key={key} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">{formatLabel(key)}</span>
            <Switch
              checked={item.visible}
              onChange={() => updateSetting(`${section}.${key}.visible`, !item.visible)}
              className={`${
                item.visible ? 'bg-green-500' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Toggle visibility</span>
              <span
                className={`${
                  item.visible ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </Switch>
          </div>

          {item.visible && (
            <div className="space-y-4 pl-8">
              {section === 'widgets' && (
                <ColorPicker
                  label="Background Color"
                  value={item.bgColor}
                  onChange={color => updateSetting(`${section}.${key}.bgColor`, color)}
                />
              )}

              {key === 'blogs' && section === 'widgets' && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Show Drafts</span>
                    <Switch
                      checked={item.showDrafts}
                      onChange={() => updateSetting(`${section}.${key}.showDrafts`, !item.showDrafts)}
                      className={`${
                        item.showDrafts ? 'bg-green-500' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Published</span>
                    <Switch
                      checked={item.showPublished}
                      onChange={() => updateSetting(`${section}.${key}.showPublished`, !item.showPublished)}
                      className={`${
                        item.showPublished ? 'bg-green-500' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    />
                  </div>
                </>
              )}

              {key === 'projects' && section === 'widgets' && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Show Active</span>
                    <Switch
                      checked={item.showActive}
                      onChange={() => updateSetting(`${section}.${key}.showActive`, !item.showActive)}
                      className={`${
                        item.showActive ? 'bg-green-500' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Completed</span>
                    <Switch
                      checked={item.showCompleted}
                      onChange={() => updateSetting(`${section}.${key}.showCompleted`, !item.showCompleted)}
                      className={`${
                        item.showCompleted ? 'bg-green-500' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    />
                  </div>
                </>
              )}

              {section === 'quickActions' && (
                <div className="flex items-center justify-between">
                  <span>Show Description</span>
                  <Switch
                    checked={item.showDescription}
                    onChange={() => updateSetting(`${section}.${key}.showDescription`, !item.showDescription)}
                    className={`${
                      item.showDescription ? 'bg-green-500' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Settings</h1>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex gap-2 p-4">
              <TabButton id="appearance" label="Appearance" icon={FaPalette} />
              <TabButton id="layout" label="Layout" icon={FaColumns} />
              <TabButton id="widgets" label="Widgets" icon={FaCode} />
              <TabButton id="quickActions" label="Quick Actions" icon={FaBolt} />
              <TabButton id="notifications" label="Notifications" icon={FaBell} />
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Theme</h3>
                  <div className="flex gap-4">
                    {THEMES.map(({ id, icon: Icon, label }) => (
                      <button
                        key={id}
                        onClick={() => updateSetting('theme.mode', id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          settings.theme.mode === id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <ColorPicker
                  label="Primary Color"
                  value={settings.theme.primaryColor}
                  onChange={color => updateSetting('theme.primaryColor', color)}
                />

                <ColorPicker
                  label="Accent Color"
                  value={settings.theme.accentColor}
                  onChange={color => updateSetting('theme.accentColor', color)}
                />
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Compact Mode</span>
                  <Switch
                    checked={settings.layout.compactMode}
                    onChange={value => updateSetting('layout.compactMode', value)}
                    className={`${
                      settings.layout.compactMode ? 'bg-green-500' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Toggle compact mode</span>
                    <span
                      className={`${
                        settings.layout.compactMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Show Greeting</span>
                  <Switch
                    checked={settings.layout.showGreeting}
                    onChange={value => updateSetting('layout.showGreeting', value)}
                    className={`${
                      settings.layout.showGreeting ? 'bg-green-500' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Toggle greeting</span>
                    <span
                      className={`${
                        settings.layout.showGreeting ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                  </Switch>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Size
                  </label>
                  <div className="flex gap-4">
                    {CARD_SIZES.map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => updateSetting('layout.cardSize', id)}
                        className={`px-4 py-2 rounded-lg ${
                          settings.layout.cardSize === id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grid Columns
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={settings.layout.gridColumns}
                    onChange={e => updateSetting('layout.gridColumns', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'widgets' && (
              <SettingsSection
                title="Widget Settings"
                items={settings.widgets}
                section="widgets"
              />
            )}

            {activeTab === 'quickActions' && (
              <SettingsSection
                title="Quick Action Settings"
                items={settings.quickActions}
                section="quickActions"
              />
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Show Notifications</span>
                  <Switch
                    checked={settings.notifications.showInDashboard}
                    onChange={value => updateSetting('notifications.showInDashboard', value)}
                    className={`${
                      settings.notifications.showInDashboard ? 'bg-green-500' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Toggle notifications</span>
                    <span
                      className={`${
                        settings.notifications.showInDashboard ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                  </Switch>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {POSITIONS.map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => updateSetting('notifications.position', id)}
                        className={`px-4 py-2 rounded-lg ${
                          settings.notifications.position === id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Auto-hide Notifications</span>
                  <Switch
                    checked={settings.notifications.autoHide}
                    onChange={value => updateSetting('notifications.autoHide', value)}
                    className={`${
                      settings.notifications.autoHide ? 'bg-green-500' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Toggle auto-hide</span>
                    <span
                      className={`${
                        settings.notifications.autoHide ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                  </Switch>
                </div>

                {settings.notifications.autoHide && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (seconds)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={settings.notifications.duration / 1000}
                      onChange={e => updateSetting('notifications.duration', parseInt(e.target.value) * 1000)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1s</span>
                      <span>5s</span>
                      <span>10s</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 