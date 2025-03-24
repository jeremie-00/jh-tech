export type ValidationErrors = {
  [key: string]: {
    _errors: string[];
  };
};

export type Result<T> = {
  data: {
    state: T;
    success: boolean;
    status: "warn" | "error" | "success" | "info";
    message: string;
  };
  serverError?: string;
  fetchError?: string;
  validationErrors?: ValidationErrors;
};

export type ColumnsProps = {
  handleShowFormForUpdate: (id: string) => void;
};

export type ImageGlobalType = {
  id: string;
  url: string;
  alt: string;
};
