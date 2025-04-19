import { createContext, useContext } from 'react'
import { socket } from '../socket.js';



const SocketContext = createContext();
export const useSocketContext = () => {
    return useContext(SocketContext);
}

const SocketProvider = ({ children }) => {
    return <SocketContext.Provider
        value={{ socket }}
    >{children}
    </SocketContext.Provider>
};



export default SocketProvider;