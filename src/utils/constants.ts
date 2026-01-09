// Deep Sea Hub Event Types
export interface DeepSeaHubEvent {
  name: string;
  description: string;
  duration: number; // in minutes
  interval: number; // in minutes (time between event starts)
  rewards: string[];
  location: string;
}

// Deep Sea Hub events rotate on a schedule
// Events typically last 1 hour and occur every 3 hours
export const DEEP_SEA_HUB_EVENTS: DeepSeaHubEvent[] = [
  {
    name: "Merchant's Arrival",
    description: "Special merchant arrives with unique items and trades",
    duration: 60,
    interval: 180,
    rewards: ["Unique shop items", "Special currency discounts", "Limited stock items"],
    location: "Deep Sea Hub - Merchant District"
  },
  {
    name: "Resource Rush",
    description: "Increased resource gathering rates and bonus drops",
    duration: 60,
    interval: 180,
    rewards: ["2x resource drops", "Bonus experience", "Rare materials"],
    location: "Deep Sea Hub - Resource Nodes"
  },
  {
    name: "Combat Training",
    description: "Enhanced combat experience and special training dummies",
    duration: 60,
    interval: 180,
    rewards: ["Bonus combat XP", "Enhanced drop rates", "Training tokens"],
    location: "Deep Sea Hub - Training Grounds"
  },
  {
    name: "Community Gathering",
    description: "Social event with group activities and rewards",
    duration: 60,
    interval: 180,
    rewards: ["Community points", "Social emotes", "Group bonuses"],
    location: "Deep Sea Hub - Central Plaza"
  }
];

// Event rotation starts at a fixed time (midnight UTC)
export const EVENT_ROTATION_START = new Date('2024-01-01T00:00:00Z');

// Colors for event status
export const EVENT_STATUS_COLORS = {
  active: '#4ade80',      // green
  upcoming: '#60a5fa',    // blue
  soon: '#fbbf24',        // yellow/amber
  completed: '#9ca3af'    // gray
};

// Notification settings
export const NOTIFICATION_TIMINGS = [
  { label: '5 minutes before', value: 5 },
  { label: '10 minutes before', value: 10 },
  { label: '15 minutes before', value: 15 },
  { label: '30 minutes before', value: 30 }
];
