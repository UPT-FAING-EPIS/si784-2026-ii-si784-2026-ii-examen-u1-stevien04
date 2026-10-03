import { useState, useEffect } from 'react';
import './App.css';

interface Babysitter {
  id: string;
  name: string;
  experienceYears: number;
  hourlyRate: number;
  rating: number;
  availability: string;
}

interface Booking {
  id: string;
  babysitterId: string;
  userId: string;
  date: string;
  status: string;
}

function App() {
  const [babysitters, setBabysitters] = useState<Babysitter[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const userId = '11111111-1111-1111-1111-111111111111';

  useEffect(() => {
    fetch('/api/babysitters')
      .then(res => res.json())
      .then(data => setBabysitters(data))
      .catch(err => console.error(err));

    fetch('/api/bookings?userId=' + userId)
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  const bookNanny = (id: string) => {
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        babysitterId: id,
        userId: userId,
        date: new Date().toISOString(),
        status: 'Confirmed'
      })
    })
    .then(res => res.json())
    .then(data => {
      setBookings([...bookings, data]);
      alert('Reserva exitosa');
    });
  };

  return (
    <div className="App">
      <header>
        <h1>Plataforma de Renta de Niñeras</h1>
        <p>Conectando familias con niñeras calificadas de manera segura y eficiente.</p>
      </header>
      
      <h2>Niñeras Disponibles</h2>
      <div className="list">
        {babysitters.map(b => (
          <div key={b.id} className="card">
            <h3>{b.name}</h3>
            <p>Experiencia: {b.experienceYears} años</p>
            <p>Disponibilidad: {b.availability}</p>
            <p>Tarifa: ${b.hourlyRate}/h</p>
            <p>Rating: {b.rating}</p>
            <button onClick={() => bookNanny(b.id)}>Reservar</button>
          </div>
        ))}
      </div>
      
      <h2>Gestión de Mis Reservas</h2>
      <ul>
        {bookings.map(b => (
          <li key={b.id}>Reserva a niñera {b.babysitterId} para el {new Date(b.date).toLocaleDateString()} - Estado: {b.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
