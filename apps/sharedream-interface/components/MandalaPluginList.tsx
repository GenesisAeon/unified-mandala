import React from 'react';
import { io as ioClient } from 'socket.io-client';

export default function MandalaPluginList() {
  const socketRef = React.useRef<any>();

  const activate = () => {
    if (!socketRef.current) {
      socketRef.current = ioClient();
      socketRef.current.on('haiku_response', (data: any) => {
        console.log('Haiku received:', data.haiku);
      });
    }
    socketRef.current.emit('sigil_alert', {
      id: 'aeon:2025-0626-HIGH-ENERGY',
      crep: {}
    });
  };

  return (
    <div>
      <button onClick={activate}>Activate mandalaHaiku</button>
    </div>
  );
}
