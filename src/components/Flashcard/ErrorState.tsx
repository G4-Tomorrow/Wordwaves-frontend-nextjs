interface ErrorStateProps {
    error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
    <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-center">
            <p className="text-xl font-semibold">Error</p>
            <p className="mt-2">{error}</p>
        </div>
    </div>
);

export default ErrorState;