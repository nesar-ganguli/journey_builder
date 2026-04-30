type ErrorStateProps = {
  message: string;
};

export const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <div className="state-panel state-panel--error">
      <h2>Unable to load graph</h2>
      <p>{message}</p>
    </div>
  );
};
