export function FetchStatus({
  isLoading,
  isError,
  errorMessage,
}: {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}) {
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center p-6">
        <div className="preview">
          <svg viewBox="0 0 50 50" className="spinner">
            <circle className="ring" cx="25" cy="25" r="22.5" />
            <circle className="line" cx="25" cy="25" r="22.5" />
          </svg>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-destructive">
        {errorMessage || "Une erreur est survenue."}
      </div>
    );
  }

  return null;
}
