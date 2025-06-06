import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_COLORS, getStatusLabel } from '../data/mockRoomData';
import { AlertTriangle, User as Mars, User as Venus } from 'lucide-react';

const RoomInfoPanel = ({ room }) => {
  if (!room) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Chọn một phòng để xem thông tin chi tiết
      </div>
    );
  }

  const maxPower = Math.max(...room.powerUsage.history, room.powerUsage.current);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Phòng {room.id}</h2>
          {room.gender && (
            room.gender === 'male' ? 
              <Mars className="w-6 h-6 text-blue-500" /> :
              <Venus className="w-6 h-6 text-pink-500" />
          )}
        </div>
        <span
          className="px-4 py-2 rounded-full text-white"
          style={{ backgroundColor: STATUS_COLORS[room.status] }}
        >
          {getStatusLabel(room)}
        </span>
      </div>

      {/* Room Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Tình trạng phòng</h3>
        {room.maintenanceHistory.length > 0 ? (
          <div className="text-gray-600">
            {room.maintenanceHistory[0].issue} - {room.maintenanceHistory[0].status}
          </div>
        ) : (
          <div className="text-green-600">Hoạt động bình thường</div>
        )}
      </div>

      {/* Occupants */}
      <div>
        <h3 className="font-semibold mb-3">Danh sách thành viên</h3>
        <div className="space-y-2">
          {room.occupants.map(occupant => (
            <div
              key={occupant.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                occupant.isLeader ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              {occupant.gender === 'male' ? 
                <Mars className="w-5 h-5 text-blue-500" /> :
                <Venus className="w-5 h-5 text-pink-500" />
              }
              <div>
                <div className="font-medium">{occupant.name}</div>
                {occupant.isLeader && (
                  <div className="text-sm text-blue-600">Trưởng phòng</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Power Usage */}
      <div>
        <h3 className="font-semibold mb-3">Mức điện tiêu thụ (kWh)</h3>
        <div className="flex items-end gap-2 h-32">
          {room.powerUsage.history.map((usage, index) => (
            <div
              key={index}
              className="flex-1 bg-blue-200 rounded-t"
              style={{
                height: `${(usage / maxPower) * 100}%`
              }}
            />
          ))}
          <div
            className="flex-1 bg-blue-500 rounded-t"
            style={{
              height: `${(room.powerUsage.current / maxPower) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Violations */}
      {room.violations > 0 && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="text-red-500" />
          <div>
            <div className="font-semibold text-red-700">
              {room.violations} lỗi vi phạm
            </div>
            <div className="text-sm text-red-600">
              Cần xem xét và có biện pháp xử lý
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

RoomInfoPanel.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    gender: PropTypes.oneOf(['male', 'female', null]),
    occupants: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      gender: PropTypes.oneOf(['male', 'female']).isRequired,
      isLeader: PropTypes.bool.isRequired
    })).isRequired,
    powerUsage: PropTypes.shape({
      current: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(PropTypes.number).isRequired
    }).isRequired,
    violations: PropTypes.number.isRequired,
    maintenanceHistory: PropTypes.arrayOf(PropTypes.shape({
      issue: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }))
  })
};

export default RoomInfoPanel;