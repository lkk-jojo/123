
import React from 'react';

export const COLORS = {
  bg: '#F7F4EB',
  card: '#FFFFFF',
  shadow: '#E0E5D5',
  primary: '#A8B58F', // Sage Green
  secondary: '#8B735B', // Earth Brown
  accent: '#E9D5CA', // Peachy Beige
  text: '#5D534A',
  categories: {
    attraction: '#B5C99A',
    food: '#FFC898',
    transport: '#87A2FB',
    hotel: '#E6A4B4',
    entertainment: '#C3B1E1',
  }
};

export const MOCK_MEMBERS = [
  { id: '1', name: '小鹿', avatar: 'https://picsum.photos/seed/deer/100/100' },
  { id: '2', name: '狸克', avatar: 'https://picsum.photos/seed/raccoon/100/100' },
  { id: '3', name: '豆狸', avatar: 'https://picsum.photos/seed/nook/100/100' },
];

export const MOCK_SCHEDULE: any[] = [
  { id: 's1', time: '11:00', title: '抵達中部國際機場', location: 'Chubu Centrair', category: 'transport', date: '2026-02-04' },
  { id: 's2', time: '13:30', title: '矢場炸豬排 名古屋駅', location: 'Nagoya Station', category: 'food', date: '2026-02-04' },
  { id: 's3', time: '15:00', title: '名古屋城 天守閣', location: 'Nagoya Castle', category: 'attraction', date: '2026-02-04' },
  { id: 's4', time: '10:00', title: '熱田神宮 參拜', location: 'Atsuta Jingu', category: 'attraction', date: '2026-02-05' },
  { id: 's5', time: '12:00', title: '蓬萊軒 鰻魚飯', location: 'Atsuta', category: 'food', date: '2026-02-05' },
];
