
export type Category = 'attraction' | 'food' | 'transport' | 'hotel' | 'entertainment';

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  category: Category;
  note?: string;
  imageUrl?: string;
  date: string; // YYYY-MM-DD
}

export interface Booking {
  id: string;
  type: 'flight' | 'stay' | 'car' | 'ticket';
  title: string;
  dateStart: string;
  dateEnd?: string;
  details: any;
  isPrivate: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  payer: string;
  splitWith: string[];
  note: string;
  date: string;
}

export interface JournalEntry {
  id: string;
  author: string;
  content: string;
  images: string[];
  date: string;
  location?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: string;
  type: 'todo' | 'luggage' | 'shopping';
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
}
