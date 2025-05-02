import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mic, Volume2, Accessibility } from "lucide-react";
import { useTranslation } from "react-i18next";




const Settings = ({ settings, onSettingsChange }) => {
  const { t } = useTranslation();

  const handleToggleVoiceAssistant = () => {
    onSettingsChange({
      ...settings,
      voiceAssistant: !settings.voiceAssistant,
    });
  };

  const handleToggleAutoRead = () => {
    onSettingsChange({
      ...settings,
      autoRead: !settings.autoRead,
    });
  };

  const handleToggleAccessibility = () => {
    onSettingsChange({
      ...settings,
      accessibility: !settings.accessibility,
    });
  };

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="space-y-3 ">
      <h3 className="text-sm font-medium mb-3">Settings</h3>

      <div className="flex items-center justify-between">
        <Label
          htmlFor="voice-assistant"
          className="text-sm flex items-center cursor-pointer"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Assistant
        </Label>
        <Switch
          id="voice-assistant"
          checked={settings.voiceAssistant}
          onCheckedChange={handleToggleVoiceAssistant}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label
          htmlFor="auto-read"
          className="text-sm flex items-center cursor-pointer"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Auto-read Responses
        </Label>
        <Switch
          id="auto-read"
          checked={settings.autoRead}
          onCheckedChange={handleToggleAutoRead}
        />
      </div>

      {/* <div className="flex items-center justify-between">
        <Label
          htmlFor="accessibility-mode"
          className="text-sm flex items-center cursor-pointer"
        >
          <Accessibility className="h-4 w-4 mr-2" />
          Accessibility Mode
        </Label>
        <Switch
          id="accessibility-mode"
          checked={settings.accessibility}
          onCheckedChange={handleToggleAccessibility}
        />
      </div> */}
    </div>
  );
};

export default Settings;
