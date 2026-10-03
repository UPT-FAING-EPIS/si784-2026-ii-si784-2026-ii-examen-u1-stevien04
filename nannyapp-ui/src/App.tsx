import { useState, useEffect } from 'react';
import './App.css';

interface Babysitter {
  id: string;
  name: string;
  experienceYears: number;
  hourlyRate: number;
  rating: number;
  availability: string;
  certifications: string;
  location: string;
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
  const [filterLocation, setFilterLocation] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterMinRating, setFilterMinRating] = useState('');
  
  // Para reservas
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const userId = '11111111-1111-1111-1111-111111111111';

  useEffect(() => {
    fetch('/api/babysitters')
      .then(res => res.json())
      .then(data => setBabysitters(data))
      .catch(err => console.error(err));

    fetch(`/api/bookings?userId=${userId}`)
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  const bookNanny = (id: string) => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y hora para la reserva.');
      return;
    }
    
    const dateTime = new Date(`${selectedDate}T${selectedTime}`).toISOString();
    
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        babysitterId: id,
        userId: userId,
        date: dateTime,
        status: 'Activa'
      })
    })
    .then(res => res.json())
    .then(data => {
      setBookings([...bookings, data]);
      alert('Reserva exitosa');
      setSelectedDate('');
      setSelectedTime('');
    });
  };

  const filteredBabysitters = babysitters.filter(b => {
    if (filterLocation && !b.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;
    if (filterMaxPrice && b.hourlyRate > parseFloat(filterMaxPrice)) return false;
    if (filterMinRating && b.rating < parseFloat(filterMinRating)) return false;
    return true;
  });

  const now = new Date();
  const activas = bookings.filter(b => new Date(b.date) >= now);
  const pasadas = bookings.filter(b => new Date(b.date) < now);

  const getBabysitterName = (id: string) => {
    return babysitters.find(b => b.id === id)?.name || id;
  };

  return (
    <div className="App">
      <header>
        <h1>Plataforma de Renta de Niñeras</h1>
        <p>Conectando familias con niñeras calificadas de manera segura y eficiente.</p>
      </header>
      
      <h2>Búsqueda y Filtros</h2>
      <div className="filters" style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px'}}>
        <input type="text" placeholder="Ubicación" value={filterLocation} onChange={e => setFilterLocation(e.target.value)} />
        <input type="number" placeholder="Precio Máx/h" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} />
        <input type="number" placeholder="Rating Mín" value={filterMinRating} onChange={e => setFilterMinRating(e.target.value)} step="0.1" max="5" />
      </div>

      <div className="booking-inputs" style={{background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
        <h3>1. Selecciona Fecha y Hora de la Reserva:</h3>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{marginRight: '10px'}} />
        <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
      </div>
      
      <h2>2. Niñeras Disponibles</h2>
      <div className="list">
        {filteredBabysitters.map(b => (
          <div key={b.id} className="card" style={{border: '1px solid #555', padding: '15px', margin: '10px', borderRadius: '8px'}}>
            <h3>{b.name}</h3>
            <p><strong>Ubicación:</strong> {b.location}</p>
            <p><strong>Experiencia:</strong> {b.experienceYears} años</p>
            <p><strong>Certificaciones:</strong> {b.certifications}</p>
            <p><strong>Disponibilidad:</strong> {b.availability}</p>
            <p><strong>Tarifa:</strong> ${b.hourlyRate}/h</p>
            <p><strong>Rating:</strong> {b.rating} ⭐</p>
            <button onClick={() => bookNanny(b.id)} style={{marginTop: '10px', padding: '10px 20px', cursor: 'pointer'}}>Reservar a {b.name.split(' ')[0]}</button>
          </div>
        ))}
        {filteredBabysitters.length === 0 && <p>No se encontraron niñeras con esos filtros.</p>}
      </div>
      
      <hr style={{margin: '40px 0'}}/>
      
      <h2>Gestión de Mis Reservas</h2>
      
      <div className="reservations" style={{display: 'flex', gap: '40px', justifyContent: 'center'}}>
        <div className="reservation-column" style={{flex: 1, background: '#333', padding: '20px', borderRadius: '8px'}}>
          <h3>Reservas Futuras / Activas</h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            {activas.map(b => (
              <li key={b.id} style={{padding: '10px', borderBottom: '1px solid #555'}}>
                <strong>{getBabysitterName(b.babysitterId)}</strong><br/>
                {new Date(b.date).toLocaleString()}<br/>
                <span style={{color: '#4caf50'}}>Estado: {b.status}</span>
              </li>
            ))}
            {activas.length === 0 && <p>Sin reservas activas.</p>}
          </ul>
        </div>
        
        <div className="reservation-column" style={{flex: 1, background: '#333', padding: '20px', borderRadius: '8px'}}>
          <h3>Reservas Pasadas</h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            {pasadas.map(b => (
              <li key={b.id} style={{padding: '10px', borderBottom: '1px solid #555'}}>
                <strong>{getBabysitterName(b.babysitterId)}</strong><br/>
                {new Date(b.date).toLocaleString()}<br/>
                <span style={{color: '#aaa'}}>Estado: Finalizada</span>
              </li>
            ))}
            {pasadas.length === 0 && <p>Sin reservas pasadas.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
