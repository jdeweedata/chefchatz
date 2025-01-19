'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { UserProfile, DietaryPreferences, CookingLevel } from '@/types/auth'

interface SettingsFormProps {
  user: UserProfile
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    dietary_preferences: user.dietary_preferences || {
      restrictions: [],
      allergies: [],
      preferences: []
    },
    cooking_level: user.cooking_level || 'beginner' as CookingLevel,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      setMessage('Settings saved successfully!')
    } catch (error) {
      console.error('Settings update error:', error)
      setMessage('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const dietaryCategories = {
    restrictions: ['vegetarian', 'vegan', 'halal', 'kosher', 'pescatarian'],
    allergies: ['nuts', 'dairy', 'shellfish', 'eggs', 'soy', 'gluten'],
    preferences: ['spicy', 'low-carb', 'mediterranean', 'keto', 'paleo']
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Profile Settings</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="mt-1 w-full rounded-md border bg-muted p-2"
            />
          </div>
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label htmlFor="cooking_level" className="text-sm font-medium">
              Cooking Level
            </label>
            <select
              id="cooking_level"
              value={formData.cooking_level}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cooking_level: e.target.value as CookingLevel,
                }))
              }
              className="mt-1 w-full rounded-md border p-2"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="space-y-4">
            {Object.entries(dietaryCategories).map(([category, options]) => (
              <div key={category}>
                <label className="text-sm font-medium capitalize">
                  {category}
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.dietary_preferences[category as keyof DietaryPreferences].includes(option)}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            dietary_preferences: {
                              ...prev.dietary_preferences,
                              [category]: e.target.checked
                                ? [...prev.dietary_preferences[category as keyof DietaryPreferences], option]
                                : prev.dietary_preferences[category as keyof DietaryPreferences].filter(
                                    (item) => item !== option
                                  ),
                            },
                          }))
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {message && (
        <div
          className={`rounded-md p-4 ${
            message.includes('success')
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
