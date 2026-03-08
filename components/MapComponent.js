import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ students, selectedStudent }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStudent) {
      map.flyTo([selectedStudent.latitude, selectedStudent.longitude], 10, {
        duration: 1.5,
      });
    } else if (students.length > 0) {
      const bounds = L.latLngBounds(
        students.map((s) => [s.latitude, s.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedStudent, students, map]);

  return null;
}

function createCustomIcon(progress) {
  let color;
  if (progress >= 75) color = '#10b981';
  else if (progress >= 50) color = '#f59e0b';
  else if (progress >= 25) color = '#667eea';
  else color = '#9ca3af';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 3px solid white;">📚</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function MapComponent({ students, selectedStudent, onStudentSelect }) {
  const center = [20, 0]; // Default center

  return (
    <div className="glass-effect rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: '600px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater students={students} selectedStudent={selectedStudent} />

        {students.map((student) => {
          const progress = (parseFloat(student.receivedAmount) / parseFloat(student.targetAmount)) * 100;
          
          return (
            <Marker
              key={student.id}
              position={[student.latitude, student.longitude]}
              icon={createCustomIcon(progress)}
              eventHandlers={{
                click: () => onStudentSelect(student),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-1">{student.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{student.location}</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => onStudentSelect(student)}
                    className="w-full bg-primary-600 text-white text-sm py-1 rounded hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
