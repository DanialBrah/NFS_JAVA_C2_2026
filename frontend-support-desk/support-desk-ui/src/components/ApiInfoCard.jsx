import LoadingMessage from './LoadingMessage';
import ErrorMessage from './ErrorMessage';

export default function ApiInfoCard({ loading, error, apiInfo }) {
    return (
        <section className="card api-card">
            <div className="section-heading">
                <h2>Backend Connection</h2>
                <p>Fetched using useEffect from the public backend endpoint.</p>
            </div>

            {loading && <LoadingMessage message="Loading API information..." />}
            {error && <ErrorMessage message={error} />}

            {!loading && !error && apiInfo && (
                <div className="api-info-grid">
                    <InfoItem label="Application" value={apiInfo.application} />
                    <InfoItem label="Version" value={apiInfo.version} />
                    <InfoItem label="Status" value={apiInfo.status} />
                </div>
            )}
        </section>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="info-item">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}
