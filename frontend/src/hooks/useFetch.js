import { useState, useEffect } from "react";

function useFetch(url, option) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(url, option);
            const data = await response.json();
            if (!response.ok) {
            throw new Error(data.error);
            }
            setData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
        };
    
        fetchData();
    }, []);
    
    return { data, error, isLoading };
}

export default useFetch;