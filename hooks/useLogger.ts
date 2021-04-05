import { useCallback } from 'react';
import { GeneralError } from '../components/error-screen';

const useLogger = () => {
    return useCallback((error: GeneralError) => {
        console.log("Report this error: ", error.message);
    }, []);
};

export default useLogger;