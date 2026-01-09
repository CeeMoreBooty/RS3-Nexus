import { DEEP_SEA_HUB_EVENTS, EVENT_ROTATION_START, DeepSeaHubEvent } from '../utils/constants';

export interface EventStatus {
  currentEvent: DeepSeaHubEvent | null;
  nextEvent: DeepSeaHubEvent | null;
  timeUntilNext: number; // milliseconds
  timeRemaining: number; // milliseconds
  isEventActive: boolean;
  upcomingEvents: Array<{
    event: DeepSeaHubEvent;
    startTime: Date;
  }>;
}

/**
 * Calculate which event is currently active based on the rotation schedule
 */
export function getCurrentEventStatus(): EventStatus {
  const now = new Date();
  const rotationStartTime = EVENT_ROTATION_START.getTime();
  const currentTime = now.getTime();
  
  // Calculate elapsed time since rotation start
  const elapsedMinutes = Math.floor((currentTime - rotationStartTime) / (1000 * 60));
  
  // Find which event should be active based on rotation
  // Events rotate in sequence with their interval times
  const totalCycleTime = DEEP_SEA_HUB_EVENTS[0].interval; // All events use same interval
  const positionInCycle = elapsedMinutes % totalCycleTime;
  
  // Determine if we're in an active event period (first 'duration' minutes of cycle)
  const eventDuration = DEEP_SEA_HUB_EVENTS[0].duration;
  const isEventActive = positionInCycle < eventDuration;
  
  // Calculate which event in the sequence
  const cycleNumber = Math.floor(elapsedMinutes / totalCycleTime);
  const currentEventIndex = cycleNumber % DEEP_SEA_HUB_EVENTS.length;
  const currentEvent = isEventActive ? DEEP_SEA_HUB_EVENTS[currentEventIndex] : null;
  
  // Calculate time remaining in current event or time until next event
  let timeRemaining: number;
  let timeUntilNext: number;
  
  if (isEventActive) {
    // Time remaining in current event
    const minutesIntoEvent = positionInCycle;
    timeRemaining = (eventDuration - minutesIntoEvent) * 60 * 1000;
    timeUntilNext = timeRemaining;
  } else {
    // Time until next event
    const minutesSinceEventEnded = positionInCycle - eventDuration;
    timeUntilNext = (totalCycleTime - eventDuration - minutesSinceEventEnded) * 60 * 1000;
    timeRemaining = 0;
  }
  
  // Calculate next event
  const nextEventIndex = (currentEventIndex + (isEventActive ? 0 : 1)) % DEEP_SEA_HUB_EVENTS.length;
  const nextEvent = isEventActive 
    ? DEEP_SEA_HUB_EVENTS[(currentEventIndex + 1) % DEEP_SEA_HUB_EVENTS.length]
    : DEEP_SEA_HUB_EVENTS[nextEventIndex];
  
  // Calculate upcoming events for next 24 hours
  const upcomingEvents = calculateUpcomingEvents(now, 24);
  
  return {
    currentEvent,
    nextEvent,
    timeUntilNext,
    timeRemaining,
    isEventActive,
    upcomingEvents
  };
}

/**
 * Calculate upcoming events for the next N hours
 */
function calculateUpcomingEvents(
  startTime: Date, 
  hours: number
): Array<{ event: DeepSeaHubEvent; startTime: Date }> {
  const events: Array<{ event: DeepSeaHubEvent; startTime: Date }> = [];
  const rotationStartTime = EVENT_ROTATION_START.getTime();
  const currentTime = startTime.getTime();
  const endTime = currentTime + (hours * 60 * 60 * 1000);
  
  const totalCycleTime = DEEP_SEA_HUB_EVENTS[0].interval;
  const elapsedMinutes = Math.floor((currentTime - rotationStartTime) / (1000 * 60));
  
  // Start from the next event cycle
  const currentCycleNumber = Math.floor(elapsedMinutes / totalCycleTime);
  
  // Look ahead for events within the time window
  const maxIterations = Math.ceil((hours * 60) / totalCycleTime) + DEEP_SEA_HUB_EVENTS.length;
  for (let i = 0; i < maxIterations; i++) {
    const cycleNumber = currentCycleNumber + Math.floor(i / DEEP_SEA_HUB_EVENTS.length) + 1;
    const eventIndex = i % DEEP_SEA_HUB_EVENTS.length;
    
    const eventStartMinutes = cycleNumber * totalCycleTime;
    const eventStartTime = new Date(rotationStartTime + (eventStartMinutes * 60 * 1000));
    
    if (eventStartTime.getTime() >= currentTime && eventStartTime.getTime() <= endTime) {
      events.push({
        event: DEEP_SEA_HUB_EVENTS[eventIndex],
        startTime: eventStartTime
      });
    }
  }
  
  return events.slice(0, 10); // Limit to first 10 upcoming events
}

/**
 * Format time remaining as HH:MM:SS
 */
export function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) return '00:00:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format time as a readable string (e.g., "2:30 PM")
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

/**
 * Get progress percentage for current event (0-100)
 */
export function getEventProgress(eventStatus: EventStatus): number {
  if (!eventStatus.isEventActive || !eventStatus.currentEvent) return 0;
  
  const duration = eventStatus.currentEvent.duration * 60 * 1000;
  const remaining = eventStatus.timeRemaining;
  const elapsed = duration - remaining;
  
  return Math.min(100, Math.max(0, (elapsed / duration) * 100));
}
