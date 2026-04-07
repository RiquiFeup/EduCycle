export const MOCK_USERS = [
  {
    id: 'seller-1',
    name: 'Sofia Martins',
    photo: 'https://i.pravatar.cc/150?u=sofia',
    course: 'Mechanical Engineering',
  },
  {
    id: 'seller-2',
    name: 'Miguel Ferreira',
    photo: 'https://i.pravatar.cc/150?u=miguel',
    course: 'Civil Engineering',
  },
  {
    id: 'seller-3',
    name: 'Beatriz Costa',
    photo: 'https://i.pravatar.cc/150?u=beatriz',
    course: 'Computer Science',
  },
  {
    id: 'seller-4',
    name: 'Tomás Oliveira',
    photo: 'https://i.pravatar.cc/150?u=tomas',
    course: 'Electrical Engineering',
  },
];

export const CONVERSATIONS = [
  {
    id: 'conv-1',
    otherUser: MOCK_USERS[0],
    lastMessage: 'Is the book still available?',
    timestamp: '2 min ago',
    unreadCount: 2,
  },
  {
    id: 'conv-2',
    otherUser: MOCK_USERS[1],
    lastMessage: 'Sure, we can meet at FEUP tomorrow.',
    timestamp: '1h ago',
    unreadCount: 0,
  },
  {
    id: 'conv-3',
    otherUser: MOCK_USERS[2],
    lastMessage: "Thanks! I'll take the calculator.",
    timestamp: '3h ago',
    unreadCount: 1,
  },
  {
    id: 'conv-4',
    otherUser: MOCK_USERS[3],
    lastMessage: 'Can you do €10 instead of €12?',
    timestamp: 'Yesterday',
    unreadCount: 0,
  },
];

const now = Date.now();

export const MESSAGES = {
  'conv-1': [
    { id: 'm1-1', text: 'Hi! I saw your listing for Matemática A.', senderId: 'seller-1', timestamp: now - 600000 },
    { id: 'm1-2', text: "Hey! Yes, it's still available.", senderId: 'me', timestamp: now - 540000 },
    { id: 'm1-3', text: 'Great! What condition is it in?', senderId: 'seller-1', timestamp: now - 480000 },
    { id: 'm1-4', text: "It's in good condition, barely used. Some light pencil marks.", senderId: 'me', timestamp: now - 420000 },
    { id: 'm1-5', text: 'Perfect. Can we meet at FEUP this week?', senderId: 'seller-1', timestamp: now - 300000 },
    { id: 'm1-6', text: 'Sure! How about Wednesday at 2pm?', senderId: 'me', timestamp: now - 240000 },
    { id: 'm1-7', text: 'Is the book still available?', senderId: 'seller-1', timestamp: now - 120000 },
  ],
  'conv-2': [
    { id: 'm2-1', text: "Hey, I'm interested in the Physics textbook.", senderId: 'me', timestamp: now - 7200000 },
    { id: 'm2-2', text: "Hi! Yes, it's the Resnick edition. \u20AC12.", senderId: 'seller-2', timestamp: now - 7000000 },
    { id: 'm2-3', text: 'Sounds good. Where can we meet?', senderId: 'me', timestamp: now - 6800000 },
    { id: 'm2-4', text: 'Sure, we can meet at FEUP tomorrow.', senderId: 'seller-2', timestamp: now - 3600000 },
  ],
  'conv-3': [
    { id: 'm3-1', text: 'Is the TI-84 calculator still up for swap?', senderId: 'me', timestamp: now - 14400000 },
    { id: 'm3-2', text: 'Yes! What do you have to offer?', senderId: 'seller-3', timestamp: now - 14000000 },
    { id: 'm3-3', text: 'I have a Casio fx-991EX, almost new.', senderId: 'me', timestamp: now - 13800000 },
    { id: 'm3-4', text: 'That works for me! Deal 🤝', senderId: 'seller-3', timestamp: now - 13000000 },
    { id: 'm3-5', text: "Thanks! I'll take the calculator.", senderId: 'seller-3', timestamp: now - 10800000 },
  ],
  'conv-4': [
    { id: 'm4-1', text: "Hello! I'd like to buy the Chemistry notes.", senderId: 'me', timestamp: now - 86400000 },
    { id: 'm4-2', text: 'Hi there! They are €12 as listed.', senderId: 'seller-4', timestamp: now - 86000000 },
    { id: 'm4-3', text: 'Can you do €10 instead of €12?', senderId: 'seller-4', timestamp: now - 85000000 },
  ],
};
