import { Result } from "@/app/types/globalType";
import { createStore } from "./globalStore";
import { useCrud } from "./useCrud";

export const fetchResourceData = async <T>(
  resourceName: string
): Promise<T[]> => {
  const response = await fetch(`/api/${resourceName}`);
  if (!response.ok)
    throw new Error(`Échec de la récupération des ${resourceName}`);
  return response.json();
};

export function createResourceCrud<T extends { id: string }>(
  resourceName: string,
  createFn: (formData: FormData) => Promise<Result<T>>,
  deleteFn: ({ id }: { id: string }) => Promise<Result<T>>,
  updateFn: (formData: FormData) => Promise<Result<T>>
) {
  const useDataStore = createStore<T>();

  return () =>
    useCrud<T>({
      store: useDataStore,
      queryKey: resourceName,
      fetchFn: () => fetchResourceData<T>(resourceName),
      createFn,
      deleteFn,
      updateFn,
    });
}
