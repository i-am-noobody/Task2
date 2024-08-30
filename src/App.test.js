import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import App from './App'; // Replace with your component's path

jest.mock('axios'); // Mock axios for controlled API responses

describe('App component', () => {
  it('renders correctly when data is fetched successfully', async () => {
    const mockData = [
      { id: 1, name: 'User 1', username: 'username1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', username: 'username2', email: 'user2@example.com' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<App />);

    await screen.findByText('User 1');

    const userElements = screen.getAllByRole('listitem');
    expect(userElements.length).toBe(2);
    expect(userElements[0].textContent).toContain('User 1');
    expect(userElements[1].textContent).toContain('User 2');
  });

  it('handles loading state correctly', async () => {
    axios.get.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    render(<App />);

    await screen.findByText('Loading users...');

    expect(screen.getByText('Loading users...')).toBeInTheDocument();

    await screen.findByText('User 1');

    expect(screen.queryByText('Loading users...')).toBeNull();
    const userElements = screen.getAllByRole('listitem');
    expect(userElements.length).toBeGreaterThan(0);
  });

  it('handles errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));

    render(<App />);

    await screen.findByText('Error fetching users');

    expect(screen.getByText('Error fetching users')).toBeInTheDocument();
  });

  it('handles no users found', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<App />);

    await screen.findByText('No users found');

    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('handles search functionality correctly', async () => {
    const mockData = [
      { id: 1, name: 'User 1', username: 'username1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', username: 'username2', email: 'user2@example.com' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<App />);

    await screen.findByText('User 1');

    const searchInput = screen.getByPlaceholderText('Search users');
    fireEvent.change(searchInput, { target: { value: 'User 1' } });

    await screen.findByText('User 1');

    const userElements = screen.getAllByRole('listitem');
    expect(userElements.length).toBe(1);
    expect(userElements[0].textContent).toContain('User 1');
  });

  it('opens and closes modal correctly', async () => {
    const mockData = [
      { id: 1, name: 'User 1', username: 'username1', email: 'user1@example.com' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<App />);

    await screen.findByText('User 1');
    fireEvent.click(screen.getAllByRole('listitem')[0]);

    expect(screen.getByText('User Details')).toBeInTheDocument();

    fireEvent.click(screen.getByText('×'));

    expect(screen.queryByText('User Details')).toBeNull();
  });
});