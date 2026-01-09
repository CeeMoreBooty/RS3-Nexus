import React, { useState, useEffect, useCallback } from 'react';
import { 
  getCurrentEventStatus, 
  formatTimeRemaining, 
  formatTime,
  getEventProgress,
  EventStatus 
} from '../services/eventTimer';
import { 
  getNotificationPreferences, 
  saveNotificationPreferences,
  requestNotificationPermission,
  showNotification,
  playNotificationSound,
  NotificationPreferences
} from '../services/notifications';
import { EVENT_STATUS_COLORS, NOTIFICATION_TIMINGS } from '../utils/constants';
import './DeepSeaHubTracker.css';

const DeepSeaHubTracker: React.FC = () => {
  const [eventStatus, setEventStatus] = useState<EventStatus>(getCurrentEventStatus());
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    getNotificationPreferences()
  );
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set());

  // Update event status every second
  useEffect(() => {
    const interval = setInterval(() => {
      setEventStatus(getCurrentEventStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check for notification triggers
  useEffect(() => {
    if (!notifications.enabled) return;

    const { timeUntilNext, nextEvent } = eventStatus;
    if (!nextEvent) return;

    const minutesUntilNext = Math.floor(timeUntilNext / (1000 * 60));
    const notificationKey = `${nextEvent.name}-${minutesUntilNext}`;

    // Check if we should notify
    if (
      minutesUntilNext <= notifications.timingMinutes &&
      minutesUntilNext > 0 &&
      !notifiedEvents.has(notificationKey) &&
      (notifications.events.length === 0 || notifications.events.includes(nextEvent.name))
    ) {
      showNotification(
        'Deep Sea Hub Event Starting Soon!',
        `${nextEvent.name} starts in ${minutesUntilNext} minute${minutesUntilNext !== 1 ? 's' : ''}`
      );

      if (notifications.soundEnabled) {
        playNotificationSound();
      }

      setNotifiedEvents(prev => new Set(prev).add(notificationKey));
    }

    // Clear old notifications
    if (minutesUntilNext > notifications.timingMinutes) {
      setNotifiedEvents(new Set());
    }
  }, [eventStatus, notifications, notifiedEvents]);

  const handleNotificationToggle = useCallback(async () => {
    if (!notifications.enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        const updated = { ...notifications, enabled: true };
        setNotifications(updated);
        saveNotificationPreferences(updated);
      }
    } else {
      const updated = { ...notifications, enabled: false };
      setNotifications(updated);
      saveNotificationPreferences(updated);
    }
  }, [notifications]);

  const handleTimingChange = useCallback((minutes: number) => {
    const updated = { ...notifications, timingMinutes: minutes };
    setNotifications(updated);
    saveNotificationPreferences(updated);
  }, [notifications]);

  const handleSoundToggle = useCallback(() => {
    const updated = { ...notifications, soundEnabled: !notifications.soundEnabled };
    setNotifications(updated);
    saveNotificationPreferences(updated);
  }, [notifications]);

  const progress = getEventProgress(eventStatus);

  return (
    <div className={`deep-sea-tracker ${isMinimized ? 'minimized' : ''}`}>
      <div className="tracker-header">
        <h2>🌊 Deep Sea Hub Events</h2>
        <div className="tracker-controls">
          <button
            className="control-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            ⚙️
          </button>
          <button
            className="control-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {showSettings && (
            <div className="settings-panel">
              <h3>Notification Settings</h3>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={notifications.enabled}
                    onChange={handleNotificationToggle}
                  />
                  Enable Notifications
                </label>
              </div>
              {notifications.enabled && (
                <>
                  <div className="setting-item">
                    <label>
                      Notify before event:
                      <select
                        value={notifications.timingMinutes}
                        onChange={(e) => handleTimingChange(Number(e.target.value))}
                      >
                        {NOTIFICATION_TIMINGS.map(timing => (
                          <option key={timing.value} value={timing.value}>
                            {timing.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={notifications.soundEnabled}
                        onChange={handleSoundToggle}
                      />
                      Play sound alert
                    </label>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="current-event-section">
            {eventStatus.isEventActive && eventStatus.currentEvent ? (
              <>
                <div className="event-status active">
                  <span className="status-indicator" style={{ backgroundColor: EVENT_STATUS_COLORS.active }}>
                    ● Event Active
                  </span>
                </div>
                <div className="event-card active-event">
                  <h3>{eventStatus.currentEvent.name}</h3>
                  <p className="event-description">{eventStatus.currentEvent.description}</p>
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{eventStatus.currentEvent.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Time Remaining:</span>
                      <span className="detail-value countdown">
                        {formatTimeRemaining(eventStatus.timeRemaining)}
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: EVENT_STATUS_COLORS.active
                      }}
                    />
                  </div>
                  <div className="rewards-section">
                    <h4>Rewards:</h4>
                    <ul>
                      {eventStatus.currentEvent.rewards.map((reward, idx) => (
                        <li key={idx}>{reward}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="event-status inactive">
                  <span className="status-indicator" style={{ backgroundColor: EVENT_STATUS_COLORS.upcoming }}>
                    ○ No Active Event
                  </span>
                </div>
                <div className="next-event-info">
                  <h3>Next Event</h3>
                  {eventStatus.nextEvent && (
                    <>
                      <h4>{eventStatus.nextEvent.name}</h4>
                      <div className="countdown-large">
                        {formatTimeRemaining(eventStatus.timeUntilNext)}
                      </div>
                      <p className="event-description">{eventStatus.nextEvent.description}</p>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="upcoming-events-section">
            <h3>Upcoming Events (Next 24h)</h3>
            <div className="events-list">
              {eventStatus.upcomingEvents.slice(0, 6).map((item, idx) => {
                const isCurrent = eventStatus.isEventActive && 
                  eventStatus.currentEvent?.name === item.event.name &&
                  idx === 0;
                
                return (
                  <div 
                    key={idx} 
                    className={`event-list-item ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="event-time">
                      {formatTime(item.startTime)}
                    </div>
                    <div className="event-name">
                      {item.event.name}
                    </div>
                    {isCurrent && (
                      <span className="current-badge">Active</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeepSeaHubTracker;
