import { toast } from 'react-hot-toast';

export const notifySuccess = (message) => toast(`${message}`, {
  icon: '👏',
  style: {
    borderRadius: '10px',
    background: '#1b1f23',
    color: '#fff'
  }
});

export const notifyFailed = (message) => toast(`${message}`, {
  icon: '❌',
  style: {
    borderRadius: '10px',
    background: '#e00202',
    color: '#fff'
  }
});