import { GridPaginationModel } from "@mui/x-data-grid";
import { useLocalStorage } from "./useLocalStorage";


type PaginationModelChangeArg = { page: number, pageSize: number };

export function usePersistPageSize(label: string, defaultPageSize = 10) {
    const { value: pageSize, setValue: setPageSize } = useLocalStorage<number>(label, defaultPageSize);

    function onPaginationModelChange(setPaginationModel: (arg: PaginationModelChangeArg) => void) {
        return function (newPaginationModel: GridPaginationModel) {
            setPageSize(newPaginationModel.pageSize)
            setPaginationModel(newPaginationModel)
        }
    }

    return {
        pageSize,
        onPaginationModelChange
    }
}