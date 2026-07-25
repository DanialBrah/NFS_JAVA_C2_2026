import { useEffect, useState } from 'react';
import ApiInfoCard from '../components/ApiInfoCard';
import { fetchApiInfo } from '../services/api';

export default function DashboardPage() {
  const [apiInfo, setApiInfo] = useState(null);
  const [loadingApi, setLoadingApi] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadApiInfo() {
      try {
        setLoadingApi(true);
        setApiError('');

        const info = await fetchApiInfo();

        if (!ignore) {
          setApiInfo(info);
        }
      } catch (error) {
        if (!ignore) {
          setApiError(
            'Could not connect to backend. Start Spring Boot on port 8080 and try again.'
          );
          console.error(error);
        }
      } finally {
        if (!ignore) {
          setLoadingApi(false);
        }
      }
    }

    loadApiInfo();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="dashboard">
      <ApiInfoCard loading={loadingApi} error={apiError} apiInfo={apiInfo} />
    </div>
  );
}
