import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { VehicleCard } from '../VehicleCard';

const mockVehicle = {
  id: '123',
  make: 'Toyota',
  model: 'Camry',
  year: 2024,
  category: 'Sedan',
  price: 25000,
  quantity: 5,
  imageUrl: 'https://example.com/camry.jpg',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('VehicleCard Component', () => {
  it('renders vehicle details correctly', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    expect(screen.getAllByText('Toyota Camry').length).toBeGreaterThan(0);
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('₹25,000')).toBeInTheDocument();
  });
});
