import { useSocket } from "../context/SocketContext";

const WebSocketIndicator = () => {
    const { isConnected } = useSocket();

    if (!isConnected) {
        return (
            <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-700 font-medium">
                    Reconnecting...
                </span>
            </div>
        );
    }

    return null;
};

export default WebSocketIndicator;
