export default interface CreateContainerInterface {
    Name: string;
    Height: number;
    Width: number;
    NoOfRows: Array<IRowDetails>;
    Depth: number;
}

interface IRowDetails {
    RowNumber: number;
    RowHeight: number;
    NoOfColumns: Array<IColumnDetails>;
}

interface IColumnDetails {
    Width: number;
}