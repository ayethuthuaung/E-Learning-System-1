export interface Notification {
  id: number;
  message: string;
  role: string; // Adjust the type if needed based on your Role structure
  read: boolean;
  deleted: boolean;
  createdAt: Date; // Add this line
}
